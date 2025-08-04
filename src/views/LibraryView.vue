<script setup>
import { useRouter } from 'vue-router'
import { loginState } from '@/api/routes/users.js'
import { onMounted, ref, computed } from 'vue'
import { getSongs, toggleFavorite, deleteSong } from '@/api/routes/songs.js'
import { useQueueStore } from '@/stores/queue.js'

const router = useRouter()
const queueStore = useQueueStore()
const songs = ref([])
const query = ref("")
const loaderVisible = ref(true)

const filteredSongs = computed(() => {
  return songs.value.filter(song => {
    const songData = `${song.title} ${song.artists.map(artist => artist = artist.artistName).join(" ")} ${song.genre}`.toLowerCase()
    const queryIncluded = query.value.split(" ").every(word => songData.includes(word.toLowerCase()))
    return queryIncluded && song.isVisible
  })
})

const handleToggleFavorite = async (songId) => {
  const song = songs.value.find(song => song.songId === songId)
  song.isFavorite = !song.isFavorite

  const response = await toggleFavorite(songId)

  if (!response.success) {
    song.isFavorite = !song.isFavorite
  }
}

const handleDeleteSong = async (songId) => {
  const song = songs.value.find(song => song.songId === songId)
  song.isVisible = false

  const response = await deleteSong(songId)

  if (response.success) {
    songs.value = songs.value.filter(song => song.songId !== songId)
  } else {
    song.isVisible = true
  }
}

const playSong = async (songId) => {
  const queue = JSON.parse(JSON.stringify(songs.value))

  // shuffle songs
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [queue[i], queue[j]] = [queue[j], queue[i]];
  }

  const songIndex = queue.findIndex(song => song.songId === songId)
  const song = queue.splice(songIndex, 1)
  queue.unshift(song[0])

  await queueStore.setQueue(queue)
}

onMounted(async () => {
  const loginResponse = await loginState()
  if (!loginResponse.loggedIn) router.push("/login")

  const songResponse = await getSongs()
  if (songResponse.success) {
    songs.value = songResponse.songs
    songs.value.map(song => {
      song.duration = `${Math.floor(song.duration / 60)}:${song.duration % 60 < 10 ? "0" : ""}${song.duration % 60}`
      song.isVisible = true
      return song
    })
  }

  loaderVisible.value = false
})
</script>
<template>
  <header>
    Library
    <div class="search-container">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF">
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
        </svg>
      </div>
      <div>
        <input type="text" placeholder="Search for something ..." v-model="query">
      </div>
    </div>
  </header>
  <div class="main-container" v-if="loaderVisible">
    <div class="loader-request"></div>
  </div>
  <div class="main-container" v-if="!loaderVisible && songs.length === 0">
    No songs yet
  </div>
  <table class="song-table">
    <tbody>
      <tr v-for="song in filteredSongs">
        <td>
          <div @click="playSong(song.songId)">
            <div>
              <img :src="song.cover" alt="">
              {{ song.title }}
            </div>
            <button class="button-dark-hover">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="6 3 20 12 6 21 6 3"/>
              </svg>
            </button>
          </div>
        </td>
        <td>{{ song.artists.map(artist => artist.artistName).join(", ") }}</td>
        <td>{{ song.genre || "(None)" }}</td>
        <td>{{ song.releaseYear }}</td>
        <td>{{ song.duration }}</td>
        <td v-if="!song.isFavorite">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" @click="handleToggleFavorite(song.songId)">
            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
          </svg>
        </td>
        <td v-if="song.isFavorite">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff00ae" @click="handleToggleFavorite(song.songId)">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </td>
        <td>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" @click="router.push(`/edit/song/${song.songId}`)">
            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" @click="handleDeleteSong(song.songId)">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
          </svg>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<style scoped>
.main-container {
  height: calc(100% - 80px);
  font-size: 25px;
}

.search-container * {
  background-color: var(--objects);
}

.song-table img {
  width: 60px;
  height: 60px;
}

.song-table svg {
  width: 30px;
  height: 30px;
}

td:first-child:hover {
  background-color: var(--objects);
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
}

td:first-child:hover button{
  background-color: var(--accent);
}

button {
  background-color: var(--background);
  height: 50px;
  width: 50px;
  border-radius: 50%;
}

button svg {
  fill: var(--background);
}
</style>