<script setup>
import { RouterView, useRoute } from 'vue-router'
import TopNavbar from './components/TopNavbar.vue'
import SideNavbar from './components/SideNavbar.vue'
import SongPlayer from './components/SongPlayer.vue'
import { useSongStore } from './stores/song.js'
import { computed } from 'vue'

const route = useRoute()
const songStore = useSongStore()
const siteContentHeight = computed(() => {
  return songStore.songUrl ? "cut-height" : "full-height"
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
      <SongPlayer v-if="songStore.songUrl"/>
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