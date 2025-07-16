<script setup>
import { useRouter } from 'vue-router'
import { loginState } from '@/api/routes/user-routes.js'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(async () => {
  const response = await loginState()
  if (!response.loggedIn) router.push("/login")
})
</script>
<template>
  <header>Edit Playlist</header>
</template>
<style scoped>

</style>