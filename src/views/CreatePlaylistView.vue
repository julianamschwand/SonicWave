<script setup>
import { useRouter } from 'vue-router'
import { loginState } from '@/api/routes/users.js'
import { onMounted, ref } from 'vue'
import { createPlaylist } from '@/api/routes/playlists.js'

const router = useRouter()
const fileInputRef = ref(null)
const name = ref("")
const description = ref("")
const coverUrl = ref("")
let cover = null

const handleCoverChange = (event) => {
  cover = event.target.files[0]
  coverUrl.value = URL.createObjectURL(cover)
}

const handleCreatePlaylist = async () => {
  if (!name.value) return

  const response = await createPlaylist(name.value, description.value, cover)
  if (response.success) {
    router.push("/playlists")
  }
}

onMounted(async () => {
  const response = await loginState()
  if (!response.loggedIn) router.push("/login")
})
</script>
<template>
  <header>Create Playlist</header>
  <div class="main-container">
    <div class="data-input-container">
      <div>
        <div>Name:</div>
        <input type="text" placeholder="Playlist name ..." v-model="name">
      </div>
      <div>
        <div>Description:</div>
        <textarea placeholder="Description ..." v-model="description"></textarea>
      </div>
    </div>
    <div class="cover-input-container">
      <div :class="{'upload-visible': coverUrl.length === 0}" @click="fileInputRef.click()">
        <img :src="coverUrl" alt="">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
          </svg>
          Upload
        </button>
        <input type="file" ref="fileInputRef"  accept="image/*" @change="handleCoverChange">
      </div>
      <button class="button-dark-hover" @click="handleCreatePlaylist">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/>
        </svg>
        Create
      </button>
      <button class="button-dark-hover" @click="router.push('/playlists')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
        </svg>
        Cancel
      </button>
    </div>
  </div>
</template>
<style scoped>
.main-container {
  align-items: flex-start;
  justify-content: flex-start;
  gap: 30px;
}

.upload-visible button {
  border: 3px solid white;
}

.upload-visible * {
  fill: white;
  color: white !important;
}
</style>