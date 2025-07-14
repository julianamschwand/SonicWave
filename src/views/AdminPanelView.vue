<script setup>
import { useRouter } from 'vue-router'
import { loginState, userdata } from '@/api/routes/user-routes.js'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(async () => {
  const loginStateResponse = await loginState()
  if (!loginStateResponse.loggedIn) router.push("/login")

  const userdataResponse = await userdata()
  if (userdataResponse.user.userRole !== "admin" && userdataResponse.user.userRole !== "owner") router.push("/")
})
</script>
<template>
  <header>Admin Panel</header>
</template>
<style scoped>

</style>