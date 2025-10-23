<script setup>
import { onMounted, ref, computed, onBeforeMount } from 'vue'
import { useQueueStore } from '@/stores/queue.js'
import { useUserStore } from '@/stores/user.js'
import { useSongStore } from '@/stores/songs.js'
import { shuffleArray } from '@/functions.js'
import SongTable from '@/components/SongTable.vue'

const userStore = useUserStore()
const queueStore = useQueueStore()
const songStore = useSongStore()
const query = ref("")

const filteredSongs = computed(() => {
  return songStore.songs.filter(song => {
    const songData = `${song.title} ${song.artists.map(artist => artist = artist.name).join(" ")} ${song.genre}`.toLowerCase()
    const queryIncluded = query.value.split(" ").every(word => songData.includes(word.toLowerCase()))
    return queryIncluded && song.isVisible
  })
})

const playSong = async (songId) => {
  const queue = JSON.parse(JSON.stringify(songStore.songs))

  const shuffledQueue = shuffleArray(queue)

  const songIndex = shuffledQueue.findIndex(song => song.songId === songId)
  const song = shuffledQueue.splice(songIndex, 1)
  shuffledQueue.unshift(song[0])

  await queueStore.initQueue(shuffledQueue)
}

onBeforeMount(async () => {
  await userStore.checkLogin()
})

onMounted(async () => {
  await songStore.getSongs()
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
  <SongTable :songs="filteredSongs" :enableSongPlay="true" :enabledComponents="['artists','genre','releaseYear','duration','favorite','edit','delete']" v-if="!songStore.loading && filteredSongs.length" @playSong="playSong"/>
  <div class="main-container" v-else>
    <div class="loader-request" v-if="songStore.loading"></div>
    <div v-else>
      <div v-if="!songStore.songs.length">No songs have been added yet</div>
      <div v-if="songStore.songs.length && !filteredSongs.length">{{ `No results for "${query}"` }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.main-container {
  font-size: 25px;
}

.search-container * {
  background-color: var(--objects);
}
</style>