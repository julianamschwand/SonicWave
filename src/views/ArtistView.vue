<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { useQueueStore } from '@/stores/queue.js'
import { useRoute } from 'vue-router'
import { singleArtist } from '@/api/routes/artists'
import BackButton from '@/components/BackButton.vue'
import router from '@/router'
import { formatDuration, shuffleArray } from '@/functions.js'


const route = useRoute()
const userStore = useUserStore()
const queueStore = useQueueStore()
const artist = ref({})

const playSong = async (shuffle, songId) => {
  const queue = JSON.parse(JSON.stringify(artist.value.songs))

  let shuffledQueue = null
  if (shuffle) {
    shuffledQueue = shuffleArray(queue)
  }

  if (songId) {
    const songIndex = shuffledQueue.findIndex(song => song.songId === songId)
    const song = shuffledQueue.splice(songIndex, 1)
    shuffledQueue.unshift(song[0])
  }

  await queueStore.initQueue(shuffledQueue || queue)
}


onBeforeMount(async () => {
  await userStore.checkLogin()
})

onMounted(async () => {
  const response = await singleArtist(route.params.id)
  if (response.success) artist.value = response.artist
})
</script>
<template>
  <header>
    <BackButton @click="router.push('/home')"/>
    <button class="icon-button" @click="router.push(`/artist/${route.params.id}/edit/artist`)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
      </svg>
    </button>
  </header>
  <div class="main-container" v-if="!artist.name">
    <div class="loader-request"></div>
  </div>
  <div id="content-container" v-else>
    <div class="playlist-head-container">
      <img :src="artist.image" alt="">
      <div>
        <div>
          <div>{{ artist.songCount + (artist.songCount === 1 ? " Song" : " Songs") }}</div>
          <div>{{ formatDuration(artist.duration) }}</div>
        </div>
        <div>
          <div>{{ artist.name }}</div>
          <div>
            <button class="button-dark-hover" @click="playSong(true)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m18 14 4 4-4 4"/>
                <path d="m18 2 4 4-4 4"/>
                <path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/>
                <path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/>
                <path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/>
              </svg>
            </button>
            <button class="button-dark-hover" @click="playSong(false)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="6 3 20 12 6 21 6 3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div id="description-container" v-if="artist.description">{{ artist.description }}</div>
    <div class="main-container" v-if="!artist.songs.length">Artist doesn't currently have any songs</div>
    <table class="library-table" v-else>
      <tbody>
        <tr v-for="song in artist.songs">
          <td>
            <div @click="playSong(true, song.songId)">
              <div>
                <img :src="song.cover" alt="">
                {{ song.title }}
                <div class="music-playing-animation" v-if="queueStore.songPlaying(song.songId)">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <button class="button-dark-hover">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="6 3 20 12 6 21 6 3"/>
                </svg>
              </button>
            </div>
          </td>
          <td>{{ song.artists.map(artist => artist.name).join(", ") || "(None)" }}</td>
          <td>{{ song.genre || "(None)" }}</td>
          <td>{{ song.releaseYear }}</td>
          <td>{{ formatDuration(song.duration) }}</td>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" @click="router.push(`/artist/${route.params.id}/edit/song/${song.songId}`)">
              <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
            </svg>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style lang="scss" scoped>
.playlist-head-container img {
  border-radius: 50%;
}

.library-table {
  margin-top: 10px;
}

#content-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.main-container {
  font-size: 25px;
}
</style>