<script setup>
import router from '@/router'
import { onMounted, ref } from 'vue'
import { allPlaylists } from '@/api/routes/playlists.js'
import { formatDuration } from '@/functions.js'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()
const playlists = ref([])
const loaderVisible = ref(true)

onMounted(async () => {
  await userStore.checkLogin()

  const playlistResponse = await allPlaylists()
  if (playlistResponse.success) playlists.value = playlistResponse.playlists
  
  loaderVisible.value = false
})
</script>
<template>
  <header>
    Playlists
    <button class="icon-button" @click="router.push('/playlists/create')">+</button>
  </header>
  <div id="playlist-container" v-if="playlists.length !== 0">
    <div class="playlist-item" v-for="playlist of playlists" @click="router.push(`/playlists/${playlist.playlistId}`)">
      <img :src="playlist.cover" alt="">
      <div>
        <div>{{ playlist.songCount + " Songs"}}</div>
        <div>{{ formatDuration(playlist.playlistDuration) }}</div>
      </div>
      <div>{{ playlist.name }}</div>
    </div>
  </div>
  <div class="main-container" v-else>
    <div class="loader-request" v-if="loaderVisible"></div>
    <div v-else>No playlists yet</div>
  </div>
</template>
<style scoped>
#playlist-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
}

.playlist-item {
  width: calc(12.5% - 70px / 8);
  background-color: var(--objects);
  aspect-ratio: 1/1.4;
  padding: 0.5%;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;
  box-sizing: border-box;
}

.playlist-item img {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 5px;
}

.playlist-item > div:not(:last-child) {
  display: flex;
  justify-content: space-between;
  font-size: 14.5px;
}

.playlist-item > div:last-child {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 25px;
  max-height: 50px; 
  font-weight: bold;
  font-size: 20px;
  margin-top: 10px;
  word-break: break-word;
}

.playlist-item:hover {
  filter: brightness(1.1);
}

.main-container {
  font-size: 25px;
}
</style>