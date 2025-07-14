<script setup>
import { useRouter } from 'vue-router'
import { loginState } from '@/api/routes/user-routes.js'
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
      <div class="button button-dark-hover" @click="router.push('/login')">Login</div>
      <div class="button button-dark-hover" @click="router.push('/register')">Register</div>
    </div>
  </div>
</template>
<style scoped>
#greeting-container {
  display: flex;
  gap: calc(var(--ui-scale) * 0.1);
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: calc(var(--ui-scale) * 0.5);
}

.button {
  background-color: var(--accent);
  border-radius: calc(var(--ui-scale) * 0.05);
  color: var(--background);
  font-weight: bold;
  width: calc(var(--ui-scale) * 3);
  height: calc(var(--ui-scale) * 0.4);
  font-size: calc(var(--ui-scale) * 0.16);
}
</style>