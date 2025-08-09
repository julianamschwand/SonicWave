<script setup>
import { useRouter, useRoute } from 'vue-router'
import { loginState } from '@/api/routes/users.js'
import { onMounted, ref } from 'vue'
import { singlePlaylist } from '@/api/routes/playlists.js'
import BackButton from '@/components/BackButton.vue'
import { formatDuration } from '@/functions.js'

const router = useRouter()
const route = useRoute()
const playlist = ref({cover: ""})

onMounted(async () => {
  const loginResponse = await loginState()
  if (!loginResponse.loggedIn) router.push("/login")

  const playlistResponse = await singlePlaylist(route.params.id)
  if (playlistResponse.success) playlist.value = playlistResponse.playlist
})
</script>
<template>
  <header>
    <BackButton @click="router.push('/playlists')"/>
    <div id="nav-button-container">
      <button class="icon-button">+</button>
      <button class="icon-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
        </svg>
      </button>
      <button class="icon-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
      </button>
    </div>
  </header>
  <div id="info-container">
    <img :src="playlist.cover" alt="">
    <div>
      <div id="info-head-container">
        <div>{{ playlist.songCount + " Songs" }}</div>
        <div>{{ formatDuration(playlist.playlistDuration) }}</div>
      </div>
      <div id="title-container">
        <div>{{ playlist.name }}</div>
        <div id="play-button-container">
          <button class="button-dark-hover">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m18 14 4 4-4 4"/>
              <path d="m18 2 4 4-4 4"/>
              <path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/>
              <path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/>
              <path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/></svg>
          </button>
          <button class="button-dark-hover">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="6 3 20 12 6 21 6 3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div id="description-container">{{ playlist.description }}</div>
</template>
<style scoped>
#nav-button-container {
  display: flex;
  gap: 3px;
}

#nav-button-container button {
  border-radius: 0px;
}

#nav-button-container button:first-child {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

#nav-button-container button:last-child {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

#info-container {
  display: flex;
  width: 100%;
  height: 180px;
}

#info-container img {
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 5px;
}

#info-container > div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  font-weight: bold;
  padding-right: 0px;
}

#info-head-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 18px;
}

#title-container {
  width: 100%;
  height: 100%;
  font-size: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#title-container div:first-child {
  max-width: calc(100% - 130px);
  overflow: hidden;
  text-overflow: ellipsis;
}

#play-button-container {
  display: flex;
  gap: 10px;
}

#play-button-container button{
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--accent);
}

#play-button-container button:first-child {
  background-color: var(--background);
  border: 3px solid var(--accent);
}

#play-button-container svg {
  fill: var(--background);
  stroke: var(--background);
  width: 35px;
  height: 35px;
} 

#play-button-container button:first-child svg {
  fill: none;
  stroke: var(--accent);
}

#description-container {
  background-color: var(--objects);
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  box-sizing: border-box;
}
</style>