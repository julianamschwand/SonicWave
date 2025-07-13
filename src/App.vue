<script setup>
import { RouterView } from 'vue-router'
import TopNavbar from './components/TopNavbar.vue'
import SideNavbar from './components/SideNavbar.vue'
</script>
<template>
  <TopNavbar/>
  <div id="layout">
    <SideNavbar/>
    <div id="site-content">
      <RouterView/>
    </div>
  </div>
</template>
<style scoped>
#layout {
  display: flex;
  height: calc(100% - var(--ui-scale) * 0.65);
  width: 100%;
}

#site-content {
  height: 100%;
  width: 100%;
  padding: calc(var(--ui-scale) * 0.35);
  overflow: auto;
  box-sizing: border-box;
}
</style>