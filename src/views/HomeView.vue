<script setup>
import { loginState } from '@/api/routes/users.js'
import { onMounted } from 'vue'
import router from '@/router'

onMounted(async () => {
  const response = await loginState()
  if (!response.loggedIn) router.push("/welcome")
})
</script>
<template>
  <header>Home</header>
</template>
<style lang="scss" scoped>

</style>