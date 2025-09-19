<script setup>
import router from '@/router'
import { useRoute } from 'vue-router'
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { useSongStore } from '@/stores/songs.js'

const route = useRoute()
const userStore = useUserStore()
const songStore = useSongStore()
const artist = ref("")
const fileInputRef = ref(null)
const coverUrl = ref("")
let cover = null
let artistAdd = []
let artistDelete = []

const song = computed(() => songStore.songs.find(song => song.songId == route.params.songId))

const goBack = () => {
  if (route.params.playlistId) {
    if (cover) window.location.href = `${window.location.protocol}//${window.location.host}/playlists/${route.params.playlistId}`
    else router.push(`/playlists/${route.params.playlistId}`)
  } else if (route.params.artistId) {
    if (cover) window.location.href = `${window.location.protocol}//${window.location.host}/artist/${route.params.artistId}`
    else router.push(`/artist/${route.params.artistId}`)
  } else {
    if (cover) window.location.href = `${window.location.protocol}//${window.location.host}/library`
    else router.push("/library")
  }
}

const addArtist = () => {
  const artistName = artist.value.trim()

  if (!artistName) return
  if (artistAdd.some(artist => artist.toLowerCase() === artistName.toLowerCase())) return
  if (song.value.artists.some(artist => artist.name.toLowerCase() === artistName.toLowerCase())) return

  song.value.artists.push({name: artistName})

  if (artistDelete.some(artist => artist.toLowerCase() === artistName.toLowerCase())) {
    artistDelete = artistDelete.filter(artist => artist.toLowerCase() !== artistName)
  } else {
    artistAdd.push(artistName)
  }  

  artist.value = ""
}

const deleteArtist = (artistName) => {
  song.value.artists = song.value.artists.filter(artist => artist.name !== artistName)
  
  if (artistAdd.includes(artistName)) {
    artistAdd = artistAdd.filter(artist => artist !== artistName)
  } else {
    artistDelete.push(artistName)
  }
}

const handleCoverChange = (event) => {
  cover = event.target.files[0]
  coverUrl.value = URL.createObjectURL(cover)
}

const handleEditSong = async () => {
  if (!song.value.title || !song.value.releaseYear) return

  const response = await songStore.editSong(route.params.songId, song.value.title, artistAdd, artistDelete, song.value.genre, song.value.releaseYear, cover)
  if (response.success) goBack()
}

onBeforeMount(async () => {
  await userStore.checkLogin()
})

onMounted(async () => {
  await songStore.getSingleSong(route.params.songId)
})
</script>
<template>
  <header>Edit Song</header>
  <div class="main-container">
    <div class="data-input-container">
      <div>
        <div>Title:</div>
        <input type="text" placeholder="Title ..." v-model="song.title">
      </div>
      <div>
        <div>Genre:</div>
        <input type="text" placeholder="Genre ..." v-model="song.genre">
      </div>
      <div>
        <div>Release year:</div>
        <input type="text" placeholder="Release year ..." v-model="song.releaseYear">
      </div>
      <div>
        <div>Artists:</div>
        <div id="artists-container">
          <div v-for="artist of song.artists">
            {{ artist.name }}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" @click="deleteArtist(artist.name)">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </div>
        </div>
        <div id="artist-input-container">
          <input type="text" placeholder="Artist ..." v-model="artist" @keyup.enter="addArtist">
          <button class="icon-button" @click="addArtist">+</button>
        </div>
      </div>
    </div>
    <div class="cover-input-container">
      <div @click="fileInputRef.click()">
        <img :src="coverUrl || song.cover" alt="Cover">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
          </svg>
          Upload
        </button>
        <input type="file" ref="fileInputRef"  accept="image/*" @change="handleCoverChange">
      </div>
      <button class="button-dark-hover" @click="handleEditSong">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/>
        </svg>
        Save
      </button>
      <button class="button-dark-hover" @click="goBack">
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

#artists-container {
  border: 2px solid var(--objects);
  border-radius: 5px;
  padding: 5px;
  height: 50px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 5px;

  div {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 5px;
    border-radius: 5px;
    background-color: var(--objects);
    width: fit-content;
  }

  svg {
    fill: white;
    height: 20px;
    width: 20px;
    cursor: pointer;

    &:hover {
      filter: brightness(0.8);
    }
  }
}

#artist-input-container {
  display: flex;
  align-items: center;
  gap: 5px;

  div {
    width: 100%;
  }
}
</style>