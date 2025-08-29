<script setup>
import { onBeforeMount } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const userStore = useUserStore()

onBeforeMount(async () => {
  await userStore.updateLogin()

  if (userStore.loggedIn) {
    router.push("/home")
  } else {
    router.push("/welcome")
  }
})
</script>
<template>
  
</template>