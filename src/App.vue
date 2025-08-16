<script setup>
import { RouterView, useRoute } from 'vue-router'
import TopNavbar from './components/TopNavbar.vue'
import SideNavbar from './components/SideNavbar.vue'
import SongPlayer from './components/SongPlayer.vue'
import { useQueueStore } from './stores/queue.js'
import { useUserStore } from './stores/user.js'
import { computed, onMounted } from 'vue'

const route = useRoute()
const userStore = useUserStore()
const queueStore = useQueueStore()
const siteContentHeight = computed(() => {
  return queueStore.queue?.length ? "cut-height" : "full-height"
})

onMounted(async () => {
  await userStore.updateLogin()

  if (userStore.loggedIn) {
    await queueStore.loadQueue()
    await userStore.fetchUserData()
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
      <SongPlayer v-if="queueStore.queue?.length && route.path !== '/login' && route.path !== '/register'"/>
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
  height: 100%;
  width: 100%;
}

#site-content {
  width: 100%;
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