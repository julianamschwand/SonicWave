<script setup>
import { useRouter } from 'vue-router'
import { loginState } from '@/api/routes/users.js'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(async () => {
  const response = await loginState()
  if (!response.loggedIn) router.push("/login")
})
</script>
<template>
  <header>Playlist</header>
</template>
<style scoped>

</style>