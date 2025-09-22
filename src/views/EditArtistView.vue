<script setup>
import router from '@/router'
import { useRoute } from 'vue-router'
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { editArtist, singleArtist } from '@/api/routes/artists.js'
import { useArtistStore } from '@/stores/artists'

const route = useRoute()
const userStore = useUserStore()
const artistStore = useArtistStore()
const fileInputRef = ref(null)
const imageUrl = ref("")
let image = null

const artist = computed(() => artistStore.artists.find(artist => artist.artistId == route.params.id))

const handleImageChange = (event) => {
  image = event.target.files[0]
  imageUrl.value = URL.createObjectURL(image)
}

const handleEditArtist = async () => {
  const response = await artistStore.editArtist(route.params.id, artist.value.name, artist.value.description, image)

  if (response.success) {
    if (image) window.location.href = `${window.location.protocol}//${window.location.host}/artist/${route.params.id}`
    else router.push(`/artist/${route.params.id}`)
  }
}

onBeforeMount(async () => {
  await userStore.checkLogin()
})

onMounted(async () => {
  await artistStore.getSingleArtist(route.params.id)
})
</script>
<template>
  <header>Edit Artist</header>
  <div class="main-container">
    <div class="data-input-container">
      <div>
        <div>Name:</div>
        <input type="text" placeholder="Artist name ..." v-model="artist.name">
      </div>
      <div>
        <div>Description:</div>
        <textarea placeholder="Artist description ..." v-model="artist.description"></textarea>
      </div>
    </div>
    <div class="cover-input-container">
      <div @click="fileInputRef.click()">
        <img :src="imageUrl || artist.image" alt="">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
          </svg>
          Upload
        </button>
        <input type="file" ref="fileInputRef"  accept="image/*" @change="handleImageChange">
      </div>
      <button class="button-dark-hover" @click="handleEditArtist">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/>
        </svg>
        Save
      </button>
      <button class="button-dark-hover" @click="router.push(`/artist/${route.params.id}`)">
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

.cover-input-container > div:first-child {
  border-radius: 50%;

  button {
    border-radius: 50%;
  }

  img {
    border-radius: 50%;
  }
}
</style>