<script setup>
import { loginState } from '@/api/routes/users.js'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(async () => {
  const response = await loginState()
  if (!response.loggedIn) router.push("/welcome")
})
</script>
<template>
  <header>Home</header>
</template>
<style scoped>

</style>