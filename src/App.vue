<script setup>
import { RouterView, useRoute } from 'vue-router'
import TopNavbar from './components/TopNavbar.vue'
import SideNavbar from './components/SideNavbar.vue'
import SongPlayer from './components/SongPlayer.vue'
import { useQueueStore } from './stores/queue.js'
import { useUserStore } from './stores/user.js'
import { computed, onMounted, onBeforeMount } from 'vue'
import { loadAllData, parseNull } from './functions.js'

const route = useRoute()
const userStore = useUserStore()
const queueStore = useQueueStore()
const siteContentHeight = computed(() => {
  return queueStore.queue?.length ? "cut-height" : "full-height"
})

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
    <div>
      <SideNavbar v-if="route.path !== '/login' && route.path !== '/register'"/>
    </div>
    <div id="main-content">
      <div id="site-content" :class="siteContentHeight">
        <RouterView/>
      </div>
      <SongPlayer v-if="queueStore.queue.length !== 0 && route.path !== '/login' && route.path !== '/register'"/>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#layout {
  display: flex;
  height: calc(100% - 65px);
  width: 100%;

  > div:first-child {
    height: 100%;
    padding-top: 5px;
    box-sizing: border-box;
  }
}

#main-content {
  flex: 1;
  height: 100%;
  width: 100%;
  min-width: 0;
}

#site-content {
  width: 100%;
  max-width: 100%;
  padding: 35px;
  overflow: auto;
  box-sizing: border-box;
}

.full-height {
  height: 100%;
}

.cut-height {
  height: calc(100% - 100px);
} 
</style>