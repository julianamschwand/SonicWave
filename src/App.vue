<script setup>
import { RouterView, useRoute } from 'vue-router'
import TopNavbar from './components/TopNavbar.vue'
import SideNavbar from './components/SideNavbar.vue'
import SongPlayer from './components/SongPlayer.vue'
import { useQueueStore } from './stores/queue.js'
import { useUserStore } from './stores/user.js'
import { useSongStore } from './stores/songs.js'
import { usePlaylistStore } from './stores/playlists.js'
import { computed, onMounted, onBeforeMount } from 'vue'
import { parseNull } from './functions.js'
import { useOtherUsersStore } from './stores/otherUsers'

const route = useRoute()
const userStore = useUserStore()
const queueStore = useQueueStore()
const songStore = useSongStore()
const playlistStore = usePlaylistStore()
const otherUsersStore = useOtherUsersStore()
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
    await userStore.fetchUserData()
    await songStore.getSongs()
    await queueStore.loadQueue()
    await songStore.fetchRecentlyPlayed()
    await playlistStore.getPlaylists()

    if (userStore.userRole === "admin" || userStore.userRole === "owner") {
      const isOwner = userStore.userRole === "owner"

      const apiRequests = [otherUsersStore.getRegisterRequests(), isOwner ? otherUsersStore.getOtherUsers() : Promise.resolve()]
      await Promise.all(apiRequests)
    }
  }
}) 
</script>
<template>
  <TopNavbar v-if="route.path !== '/login' && route.path !== '/register'"/>
  <div id="layout">
    <SideNavbar v-if="route.path !== '/login' && route.path !== '/register'"/>
    <div id="main-content">
      <div id="site-content" :class="siteContentHeight">
        <RouterView/>
      </div>
      <SongPlayer v-if="queueStore.queue.length !== 0 && route.path !== '/login' && route.path !== '/register'"/>
    </div>
  </div>
</template>
<style scoped>
#layout {
  display: flex;
  height: calc(100% - 65px);
  width: 100%;
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
  height: calc(100% - 110px);
} 
</style>