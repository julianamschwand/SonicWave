<script setup>
import { onMounted, ref } from 'vue'
import { downloadSong } from '@/api/routes/songs'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()
const url = ref("")
const downloading = ref(false)
const errorMessage = ref("")
const successMessage = ref("")

const handleDownload = async () => {
  if (!url.value.trim()) {
    errorMessage.value += "Enter a URL"
    return
  }

  const tempUrl = url.value
  url.value = ""

  downloading.value = true
  const response = await downloadSong(tempUrl)

  if (response.success) {
    errorMessage.value = ""
    successMessage.value = response.message
  } else {
    successMessage.value = ""
    errorMessage.value = response.message
  }

  downloading.value = false
}

onMounted(async () => {
  await userStore.checkLogin()
})
</script>
<template>
  <header>Download</header>
  <div class="main-container">
    <div id="center-container">
      <h1>Enter Song-URL</h1>
      <div id="downloadbar-container">
        <div><input type="text" placeholder="URL ..." v-model="url" @keydown.enter="handleDownload"></div>
        <div v-if="downloading">
          <div class="loader-download"></div>
        </div>
        <button class="button-dark-hover" @click="handleDownload" v-if="!downloading">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
          </svg>
        </button>
      </div>
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
}

#downloadbar-container {
  width: 350px;
  display: flex;
  align-items: center;
  gap: 5px;

  div {
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
  fill: var(--background);
}

h1 {
  font-size: 27px;
}

button {
  background-color: var(--accent) !important;
  height: 40px;
  width: 40px;
}

.loader-download {
  background-color: var(--accent) !important;
}
</style>