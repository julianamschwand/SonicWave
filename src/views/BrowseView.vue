<script setup>
import { onMounted, ref } from 'vue'
import { browseSongs, downloadSong } from '@/api/routes/songs'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()
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

const handleDownload = async (url, index) => {
  songs.value[index]["status"] = "downloading"

  const response = await downloadSong(url)

  if (response.success) {
    songs.value[index]["status"] = "success"
  } else {
    songs.value[index]["status"] = "error"
  }
}

onMounted(async () => {
  await userStore.checkLogin()
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
      <button class="button-dark-hover" @click="handleBrowse">🡲</button>
    </div>
  </header>
  <div class="main-container" v-if="loaderVisible">
    <div class="loader-request"></div>
  </div>
  <table class="browse-table">
    <tbody>
      <tr v-for="(song, index) in songs">
        <td><img :src="song.cover" alt="">{{ song.title }}</td>
        <td>{{ song.artist }}</td>
        <td>{{ song.genre }}</td>
        <td v-if="!song.status">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" @click="handleDownload(song.url, index)">
              <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
            </svg>
          </div>
        </td>
        <td v-if="song.status === 'downloading'">
          <div>
            <div class="loader-download"></div>
          </div>
        </td>
        <td v-if="song.status === 'success'">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" class="unclickable">
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
          </div>
        </td>
        <td v-if="song.status === 'error'">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" class="unclickable">
              <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
            </svg>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="main-container" v-if="greetingVisible">
    Browse for songs
  </div>
</template>
<style scoped>
#search-bar-container {
  display: flex;
  gap: 5px;
}

button {
  background-color: var(--accent);
  color: var(--background);
  height: 40px;
  width: 40px;
}

.search-container * {
  background-color: var(--objects);
}

.main-container {
  font-size: 25px;
}

#loader-container {
  display: flex;
  justify-content: center;
}

.loader-download {
  background-color: white;
  margin-right: 4px;
}
</style>