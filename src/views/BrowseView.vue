<script setup>
import { onBeforeMount, ref } from 'vue'
import { browseSongs, downloadSong } from '@/api/routes/songs'
import { useUserStore } from '@/stores/user.js'
import SongTable from '@/components/SongTable.vue'

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

onBeforeMount(async () => {
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
  <SongTable :songs="songs" :coverSize="100" :enabledComponents="['artists', 'genre', 'download']"/>
  <div class="main-container" v-if="greetingVisible">
    Browse for songs
  </div>
</template>
<style lang="scss" scoped>
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
</style>