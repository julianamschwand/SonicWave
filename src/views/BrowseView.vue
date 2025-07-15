<script setup>
import { useRouter } from 'vue-router'
import { loginState } from '@/api/routes/user-routes.js'
import { onMounted, ref } from 'vue'
import { browseSongs } from '@/api/routes/song-routes'

const router = useRouter()
const query = ref("")
const songs = ref([])
const loaderVisible = ref(false)
const greetingVisible = ref(true)

const handleBrowse = async () => {
  if (!query.value.trim()) return

  greetingVisible.value = false

  songs.value = []
  loaderVisible.value = true

  const response = await browseSongs(query.value)

  loaderVisible.value = false
  songs.value = response.songs
}

onMounted(async () => {
  const response = await loginState()
  if (!response.loggedIn) router.push("/login")
})
</script>
<template>
  <header>
    Browse
    <div id="search-bar-container">
      <div class="search-container">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
          </svg>
        </div>
        <div>
          <input type="text" placeholder="Search for something ..." v-model="query" @keydown.enter="handleBrowse">
        </div>
      </div>
      <div class="button button-dark-hover" id="search-button" @click="handleBrowse">🡲</div>
    </div>
  </header>
  <div id="loader-container" v-if="loaderVisible">
    <div class="loader-request"></div>
  </div>
  <table class="song-table">
    <tr v-for="song in songs">
      <td><img :src="song.cover" alt="">{{ song.title }}</td>
      <td>{{ song.artist }}</td>
      <td>{{ song.genre }}</td>
      <td>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF">
          <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
        </svg>
      </td>
    </tr>
  </table>
  <div class="main-container" v-if="greetingVisible">
    Browse for songs
  </div>
</template>
<style scoped>
#search-bar-container {
  display: flex;
  gap: calc(var(--ui-scale) * 0.05);
}

#search-button {
  background-color: var(--accent);
  color: var(--background);
  height: calc(var(--ui-scale) * 0.4);
  width: calc(var(--ui-scale) * 0.4);
}

.search-container * {
  background-color: var(--objects);
}

.main-container {
  height: calc(100% - calc(var(--ui-scale) * 0.8));
  font-size: calc(var(--ui-scale) * 0.25);
}

#loader-container {
  display: flex;
  justify-content: center;
}
</style>