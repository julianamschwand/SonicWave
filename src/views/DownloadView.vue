<script setup>
import { onBeforeMount, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { useSongStore } from '@/stores/songs.js'
import { useLocalOptionsStore } from '@/stores/localOptions.js'

const userStore = useUserStore()
const songStore = useSongStore()
const localOptionsStore = useLocalOptionsStore()
const url = ref("")
const downloading = ref(false)
const errorMessage = ref("")
const successMessage = ref("")
const downloadAction = reactive([])
const downloadStats = reactive([])

const handleDownload = async () => {
  if (!url.value.trim()) {
    errorMessage.value += "Enter a URL"
    return
  }

  successMessage.value = ""
  errorMessage.value = ""

  const tempUrl = url.value
  url.value = ""
  downloading.value = true

  const response = localOptionsStore.downloadMode === "song" ? 
    await songStore.downloadSong(tempUrl, downloadAction, downloadStats, 0) : 
    await songStore.downloadPlaylist(tempUrl, downloadAction, downloadStats, 0)

  if (response.success) successMessage.value = response.message
  else errorMessage.value = response.message
  
  downloading.value = false
}

onBeforeMount(async () => {
  await userStore.checkLogin()
  localOptionsStore.getLocalOptions()
})
</script>
<template>
  <header>Download</header>
  <div class="main-container">
    <div id="center-container">
      <h1>{{ `Enter ${localOptionsStore.downloadMode === "song" ? "Song" : "Playlist"}-URL` }}</h1>
      <div>
        <div class="mode-selector">
          <button :class="{ 'mode-selected': localOptionsStore.downloadMode === 'song', 'button-dark-hover': true }" @click="localOptionsStore.setDownloadMode('song')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M500-360q42 0 71-29t29-71v-220h120v-80H560v220q-13-10-28-15t-32-5q-42 0-71 29t-29 71q0 42 29 71t71 29ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/>
            </svg>
          </button>
          <button :class="{ 'mode-selected': localOptionsStore.downloadMode === 'playlist', 'button-dark-hover': true }" @click="localOptionsStore.setDownloadMode('playlist')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M640-160q-50 0-85-35t-35-85q0-50 35-85t85-35q11 0 21 1.5t19 6.5v-328h200v80H760v360q0 50-35 85t-85 35ZM120-320v-80h320v80H120Zm0-160v-80h480v80H120Zm0-160v-80h480v80H120Z"/>
            </svg>
          </button>
        </div>
        <div id="downloadbar-container">
          <div><input type="text" placeholder="URL ..." v-model="url" @keydown.enter="handleDownload"></div>
          <div v-if="downloading">
            <div class="loader-download"></div>
          </div>
          <button class="button-dark-hover download-button" @click="handleDownload" v-else>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="download-action-container" v-if="downloadAction[0]">{{ downloadAction[0] }}</div>
      <div class="progress-bar" v-if="downloadStats[0]">
        <div :style="`width: ${downloadStats[0].maxSongs ?
          ((downloadStats[0].currentSong - 1 + downloadStats[0].progress / 100) / downloadStats[0].maxSongs) * 100 :
          downloadStats[0].progress}%`">
        </div>
      </div>
      <div class="download-speed" v-if="downloadStats[0]">{{ downloadStats[0].speed }}</div>
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      <div class="success-message" v-if="successMessage">{{ successMessage }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.main-container {
  height: calc(100% - 80px * 2)
}

#center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 435px;

  > div {
    display: flex;
    gap: 5px;
  }

  .download-action-container {
    font-size: 19x;
  }

  .progress-bar {
    width: 100%;
    height: 7px;
    border: 1px solid var(--accent);
    border-radius: 5px;

    > div {
      height: 100%;
      background-color: var(--accent);
      border-radius: 5px;
    }
  }

  > .download-speed {
    width: 100%;
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }
}

#downloadbar-container {
  width: 350px;
  display: flex;
  align-items: center;
  gap: 5px;

  > div {
    display: flex;
    align-items: center;
    padding: 0px;
    background-color: var(--objects);
    justify-content: center;
    width: 40px;
    height: 40px;
    box-sizing: border-box;
    border-radius: 5px;
  }

  > div:first-child {
    width: calc(100% - 45px);
    padding-left: 10px;
    padding-right: 10px;
  } 

  input {
    background-color: var(--objects);
    font-size: 15px;
    border: none;
    outline: none;
    width: 100%;
  }
}

svg {
  height: 24px;
  width: 24px;
}

h1 {
  font-size: 27px;
}

.download-button {
  background-color: var(--accent) !important;
  height: 40px;
  width: 40px;

  svg {
    fill: var(--background);
  }
}

.loader-download {
  background-color: var(--accent) !important;
}

.mode-selector {
  width: 80px;
  display: flex;
  border: 2px solid var(--accent);
  border-radius: 5px;
  box-sizing: border-box;

  > button {
    height: 100%;
    width: 50%;
    background-color: transparent;
    border-radius: 0px;
    
    svg {
      fill: var(--accent);
    }
  }

  .mode-selected {
    background-color: var(--accent);

    svg {
      fill: var(--background);
    }
  }
}
</style>