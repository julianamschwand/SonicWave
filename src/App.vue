<script setup>
import { RouterView } from 'vue-router'
import TopNavbar from './components/TopNavbar.vue'
import SideNavbar from './components/SideNavbar.vue'
</script>
<template>
  <TopNavbar/>
  <div id="layout">
    <SideNavbar/>
    <RouterView/>
  </div>
</template>
<style scoped>
#layout {
  display: flex;
  height: calc(100% - var(--navbar-size));
}
</style>