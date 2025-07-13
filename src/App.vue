<script setup>
import { RouterView } from 'vue-router'
import TopNavbar from './components/TopNavbar.vue'
import SideNavbar from './components/SideNavbar.vue'
</script>

<template>
  <TopNavbar/>
  <SideNavbar/>
  <RouterView/>
</template>

<style scoped>

</style>