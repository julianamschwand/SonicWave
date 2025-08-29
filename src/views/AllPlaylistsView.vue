<script setup>
import router from '@/router'
import { onBeforeMount, onMounted, ref } from 'vue'
import { allPlaylists } from '@/api/routes/playlists.js'
import { useUserStore } from '@/stores/user.js'
import PlaylistItem from '@/components/PlaylistItem.vue'

const userStore = useUserStore()
const playlists = ref([])
const loaderVisible = ref(true)

onBeforeMount(async () => {
  await userStore.checkLogin()
})

onMounted(async () => {
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
    <div v-for="playlist of playlists">
      <PlaylistItem :playlist="playlist" @click="router.push(`/playlists/${playlist.playlistId}`)"/>
    </div>
  </div>
  <div class="main-container" v-else>
    <div class="loader-request" v-if="loaderVisible"></div>
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