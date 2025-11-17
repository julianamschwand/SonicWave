<script setup>
import router from '@/router'
import { onMounted } from 'vue'
import { usePlaylistStore } from '@/stores/playlists.js'
import PlaylistItem from '@/components/PlaylistItem.vue'
import { useDeviceStore } from '@/stores/device.js'

const playlistStore = usePlaylistStore()
const deviceStore = useDeviceStore()

onMounted(async () => {
  await playlistStore.getPlaylists()
})
</script>
<template>
  <header>
    <div v-if="!deviceStore.isMobile">Playlists</div>
    <button class="icon-button" @click="router.push('/playlists/create')">+</button>
  </header>
  <div id="playlist-container" v-if="playlistStore.playlists.length !== 0">
    <div v-for="playlist of playlistStore.playlists">
      <PlaylistItem :playlist="playlist" @click="router.push(`/playlists/${playlist.playlistId}`)"/>
    </div>
  </div>
  <div class="main-container" v-else>
    <div class="loader-request" v-if="playlistStore.playlistsLoading"></div>
    <div v-else>No playlists have been added yet</div>
  </div>
</template>
<style lang="scss" scoped>
#playlist-container {
  display: grid;
  gap: 10px;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.main-container {
  font-size: 25px;
}

@media (max-aspect-ratio: 4/3) {
  header {
    justify-content: flex-end;
  }
}
</style>