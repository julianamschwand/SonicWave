<script setup>
import { useRouter } from 'vue-router'
import { loginState } from '@/api/routes/users.js'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(async () => {
  const response = await loginState()
  if (response.loggedIn) router.push("/")
})
</script>
<template>
  <div class="main-container">
    <div id="greeting-container">
      <h1>Welcome to SonicWave!</h1>
      <button class="button-dark-hover" @click="router.push('/login')">Login</button>
      <button class="button-dark-hover" @click="router.push('/register')">Register</button>
    </div>
  </div>
</template>
<style scoped>
#greeting-container {
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 50px;
}

button {
  background-color: var(--accent);
  border-radius: 5px;
  color: var(--background);
  font-weight: bold;
  width: 300px;
  height: 40px;
  font-size: 16px;
}
</style>