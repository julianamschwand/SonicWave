<script setup>
import { RouterView, useRoute } from 'vue-router'
import TopNavbar from './components/TopNavbar.vue'
import ButtonNavbar from './components/ButtonNavbar.vue'
import SongPlayer from './components/SongPlayer.vue'
import { useQueueStore } from './stores/queue.js'
import { useUserStore } from './stores/user.js'
import { onMounted, onBeforeMount } from 'vue'
import { loadAllData, parseNull } from './functions.js'
import { useDeviceStore } from './stores/device.js'

const route = useRoute()
const userStore = useUserStore()
const queueStore = useQueueStore()
const deviceStore = useDeviceStore()

onBeforeMount(() => {
  const backgroundColor = parseNull(localStorage.getItem("backgroundColor"))
  const objectsColor = parseNull(localStorage.getItem("objectsColor"))
  const accentColor = parseNull(localStorage.getItem("accentColor"))

  if (backgroundColor) document.documentElement.style.setProperty("--background", backgroundColor)
  if (objectsColor) document.documentElement.style.setProperty("--objects", objectsColor)
  if (accentColor) document.documentElement.style.setProperty("--accent", accentColor)
})

onMounted(async () => {
  await userStore.updateLogin()

  if (userStore.loggedIn) {
    await loadAllData()
  }
}) 
</script>
<template>
  <TopNavbar v-if="route.path !== '/login' && route.path !== '/register'"/>
  <div id="layout">
    <div v-if="route.path !== '/login' && route.path !== '/register' && !deviceStore.isMobile">
      <ButtonNavbar v-if="route.path !== '/login' && route.path !== '/register'"/>
    </div>
    <div id="main-content">
      <div id="site-content">
        <RouterView/>
      </div>
      <SongPlayer v-if="queueStore.queue.length !== 0 && route.path !== '/login' && route.path !== '/register'"/>
      <ButtonNavbar v-if="deviceStore.isMobile"/>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#layout {
  display: flex;
  height: calc(100% - 65px);
  width: 100%;
  gap: 5px;

  > div:first-child {
    height: 100%;
    padding-top: 5px;
    box-sizing: border-box;
  }
}

#main-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  height: 100%;
  width: 100%;
  min-width: 0;
}

#site-content {
  width: 100%;
  max-width: 100%;
  flex: 1;
  padding: 35px;
  overflow: auto;
  box-sizing: border-box;
}

@media (max-aspect-ratio: 4/3) {
  #site-content {
    padding: 10px;
  }

  #layout {
    height: calc(100% - 55px);
  }
}
</style>