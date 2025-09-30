<script setup>
import { onBeforeMount, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { useQueueStore } from '@/stores/queue.js'
import { useRoute } from 'vue-router'
import BackButton from '@/components/BackButton.vue'
import router from '@/router'
import { formatDuration, shuffleArray } from '@/functions.js'
import { useArtistStore } from '@/stores/artists'
import { useSongStore } from '@/stores/songs'
import SongTable from '@/components/SongTable.vue'

const route = useRoute()
const userStore = useUserStore()
const queueStore = useQueueStore()
const artistStore = useArtistStore()
const songStore = useSongStore()

const artist = computed(() => artistStore.artists.find(artist => artist.artistId == route.params.id)) 
const songs = computed(() => {
  if (!artist.value) return []
  return artist.value.songs.map(songId => songStore.songs.find(song => song.songId == songId))
})

const playSong = async (shuffle, songId) => {
  const queue = JSON.parse(JSON.stringify(songs.value))

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
  await artistStore.getSingleArtist(route.params.id)
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
  <div class="main-container" v-if="!artist?.name">
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
    <div class="playlist-description-container" v-if="artist.description">{{ artist.description }}</div>
    <div class="main-container" v-if="!songs.length">Artist doesn't currently have any songs</div>
    <SongTable :songs="songs" :enableSongPlay="true" :artistId="route.params.id" :enabledComponents="['artists', 'genre', 'releaseYear', 'favorite', 'edit']" v-else @playSong="(songId) => playSong(true, songId)"/>
  </div>
</template>
<style lang="scss" scoped>
.playlist-head-container img {
  border-radius: 50%;
}

#content-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  > div:last-child {
    margin-top: 10px;
  }
}

.main-container {
  font-size: 25px;
}
</style>