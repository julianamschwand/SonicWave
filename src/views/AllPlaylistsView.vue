<script setup>
import router from '@/router'
import { onMounted } from 'vue'
import { usePlaylistStore } from '@/stores/playlists.js'
import PlaylistItem from '@/components/PlaylistItem.vue'

const playlistStore = usePlaylistStore()

onMounted(async () => {
  await playlistStore.getPlaylists()
})
</script>
<template>
  <header>
    Playlists
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
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;

  > div {
    width: calc(12.5% - 70px / 8);
  }
}

.main-container {
  font-size: 25px;
}
</style>