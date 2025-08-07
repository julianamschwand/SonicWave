<script setup>
import { useRouter } from 'vue-router'
import { loginState } from '@/api/routes/users.js'
import { onMounted, ref } from 'vue'
import { allPlaylists } from '@/api/routes/playlists.js'
import { formatDuration } from '@/functions.js'

const router = useRouter()
const playlists = ref([])

onMounted(async () => {
  const loginResponse = await loginState()
  if (!loginResponse.loggedIn) router.push("/login")

  const playlistResponse = await allPlaylists()
  if (playlistResponse.success) playlists.value = playlistResponse.playlists
})
</script>
<template>
  <header>
    Playlists
    <button id="add-button" class="button-dark-hover" @click="router.push('/playlists/create')">+</button>
  </header>
  <div id="playlist-container">
    <div class="playlist-item" v-for="playlist of playlists" @click="router.push(`/playlists/${playlist.playlistId}`)">
      <img :src="playlist.cover" alt="">
      <div>
        <div>{{ playlist.songCount + " Songs"}}</div>
        <div>{{ formatDuration(playlist.playlistLength) }}</div>
      </div>
      <div>{{ playlist.name }}</div>
    </div>
  </div>
</template>
<style scoped>
  #add-button {
    height: 40px;
    width: 40px;
    background-color: var(--accent);
    color: var(--background);
    font-weight: bold;
    font-size: 30px;
  }

  #playlist-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 10px;
    width: 100%;
  }

  .playlist-item {
    background-color: var(--objects);
    width: 170px;
    height: 260px;
    padding: 10px;
    border-radius: 5px;
    user-select: none;
    cursor: pointer;
  }

  .playlist-item img {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 5px;
  }

  .playlist-item > div:not(:last-child) {
    display: flex;
    justify-content: space-between;
    font-size: 14.5px;
  }

  .playlist-item > div:last-child {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 25px;
    max-height: 50px; 
    font-weight: bold;
    font-size: 20px;
    margin-top: 10px;
    word-break: break-word;
  }

  .playlist-item:hover {
    filter: brightness(1.1);
  }
</style>