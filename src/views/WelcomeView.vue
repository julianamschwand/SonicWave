<script setup>
import router from '@/router'
import { onBeforeMount } from 'vue'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()

onBeforeMount(async () => {
  await userStore.updateLogin()
  if (userStore.loggedIn) router.push("/home")
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
<style lang="scss" scoped>
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