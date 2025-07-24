<script setup>
import { RouterView, useRoute } from 'vue-router'
import TopNavbar from './components/TopNavbar.vue'
import SideNavbar from './components/SideNavbar.vue'

const route = useRoute()
</script>
<template>
  <TopNavbar v-if="route.path !== '/login' && route.path !== '/register'"/>
  <div id="layout">
    <SideNavbar v-if="route.path !== '/login' && route.path !== '/register'"/>
    <div id="site-content">
      <RouterView/>
    </div>
  </div>
</template>
<style scoped>
#layout {
  display: flex;
  height: calc(100% - 65px);
  width: 100%;
}

#site-content {
  height: 100%;
  width: 100%;
  padding: 35px;
  overflow: auto;
  box-sizing: border-box;
}
</style>