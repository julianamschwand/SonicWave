<script setup>
import router from '@/router'
import { useRoute } from 'vue-router'
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { usePlaylistStore } from '@/stores/playlists'

const route = useRoute()
const userStore = useUserStore()
const playlistStore = usePlaylistStore()
const fileInputRef = ref(null)
const coverUrl = ref("")
let cover = null

const playlist = computed(() => playlistStore.playlists.find(playlist => playlist.playlistId == route.params.id) || {name: "", description: ""})

const handleCoverChange = (event) => {
  cover = event.target.files[0]
  coverUrl.value = URL.createObjectURL(cover)
}

const handleEditPlaylist = async () => {
  if (!playlist.value.name) return

  const response = await playlistStore.editPlaylist(route.params.id, playlist.value.name, playlist.value.description, cover)

  if (response.success) {
    if (cover) window.location.href = `${window.location.protocol}//${window.location.host}/playlists/${route.params.id}`
    else router.push(`/playlists/${route.params.id}`)
  }
}

onBeforeMount(async () => {
  await userStore.checkLogin()
})

onMounted(async () => {
  await playlistStore.getSinglePlaylist(route.params.id)
})
</script>
<template>
  <header>Edit Playlist</header>
  <div class="main-container">
    <div class="data-input-container">
      <div>
        <div>Name:</div>
        <input type="text" placeholder="Playlist name ..." v-model="playlist.name">
      </div>
      <div>
        <div>Description:</div>
        <textarea placeholder="Playlist description ..." v-model="playlist.description"></textarea>
      </div>
    </div>
    <div class="cover-input-container">
      <div @click="fileInputRef.click()">
        <img :src="coverUrl || playlist.cover" alt="cover">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
          </svg>
          Upload
        </button>
        <input type="file" ref="fileInputRef"  accept="image/*" @change="handleCoverChange">
      </div>
      <button class="button-dark-hover" @click="handleEditPlaylist">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/>
        </svg>
        Save
      </button>
      <button class="button-dark-hover" @click="router.push(`/playlists/${route.params.id}`)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
        </svg>
        Cancel
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.main-container {
  align-items: flex-start;
  justify-content: flex-start;
  gap: 30px;
}
</style>