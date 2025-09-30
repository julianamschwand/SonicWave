<script setup>
import router from '@/router'
import { useRoute } from 'vue-router'
import { onMounted, computed, onBeforeMount } from 'vue'
import BackButton from '@/components/BackButton.vue'
import { formatDuration } from '@/functions.js'
import { useQueueStore } from '@/stores/queue.js'
import { useUserStore } from '@/stores/user.js'
import { usePlaylistStore } from '@/stores/playlists.js'
import { useSongStore } from '@/stores/songs.js'
import { shuffleArray } from '@/functions.js'
import SongTable from '@/components/SongTable.vue'

const route = useRoute()
const userStore = useUserStore()
const queueStore = useQueueStore()
const playlistStore = usePlaylistStore()
const songStore = useSongStore()

const playlist = computed(() => playlistStore.playlists.find(playlist => playlist.playlistId == route.params.id))

const songs = computed(() => {
  if (!playlist.value) return []
  return playlist.value.songs.map(songId => songStore.songs.find(song => song.songId == songId)).filter(song => song?.isVisible)
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
  await playlistStore.getSinglePlaylist(route.params.id)
})
</script>
<template>
  <header>
    <BackButton @click="router.push('/playlists')"/>
    <div id="nav-button-container">
      <button class="icon-button" @click="router.push(`/playlists/${route.params.id}/add-songs`)">+</button>
      <button class="icon-button" @click="router.push(`/playlists/${route.params.id}/edit/playlist`)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
        </svg>
      </button>
      <button class="icon-button" @click="playlistStore.deletePlaylist(route.params.id)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
      </button>
    </div>
  </header>
  <div class="main-container" v-if="!playlist?.name">
    <div class="loader-request"></div>
  </div>
  <div id="content-container" v-else>
    <div class="playlist-head-container">
      <img :src="playlist.cover" alt="">
      <div>
        <div>
          <div>{{ playlist.songCount + " Songs" }}</div>
          <div>{{ formatDuration(playlist.duration) }}</div>
        </div>
        <div>
          <div>{{ playlist.name }}</div>
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
    <div class="playlist-description-container" v-if="playlist.description">{{ playlist.description }}</div>
    <div class="main-container" v-if="!songs.length">No songs have been added yet</div>
    <SongTable :songs="songs" :enableSongPlay="true" :playlistId="route.params.id" :enabledComponents="['artists', 'genre', 'releaseYear', 'duration', 'favorite', 'edit', 'remove']" v-else @playSong="(songId) => playSong(true, songId)"/>
  </div>
</template>
<style lang="scss" scoped>
#nav-button-container {
  display: flex;
  gap: 3px;

  button {
    border-radius: 0px;

    &:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    &:last-child {
      border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    }
  }
}

.library-table {
  margin-top: 10px;
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