<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import BackButton from '@/components/BackButton.vue'
import { useUserStore } from '@/stores/user.js'

const router = useRouter()
const userStore = useUserStore()
const emailUsername = ref("")
const password = ref("")
const errorMessage = ref("")

const handleLogin = async () => {
  let email = null
  let username = null

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailUsername.value)) {
    email = emailUsername.value
  } else {
    username = emailUsername.value
  }

  const response = await userStore.login(username, email, password.value)
  if (!response.success) {
    errorMessage.value = response.message
  }
}
</script>
<template>
  <BackButton @click="router.push('/welcome')"/>
  <div class="main-container">
    <div id="center-container">
      <img src="/images/logo.png" alt="">
      <div id="login-container">
        <form @submit.prevent="handleLogin">
          <label for="email-username">E-Mail or Username:</label>
          <input type="text" id="email-username" placeholder="user@example.com" v-model="emailUsername">
          <label for="password">Password:</label>
          <input type="password" id="password" placeholder="Password" v-model="password">
          <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
          <button type="submit" class="button button-dark-hover" id="login-button">Login</button>
          <button class="button button-dark-hover" id="register-button" @click="router.push('/register')">Register</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
#login-container {
  display: flex;
  background-color: var(--objects);
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  border-radius: 10px;
  width: 75%;
}

#center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

input {
  background-color: var(--background);
  outline: none;
  border: none;
  padding: 10px;
  border-radius: 5px;
  font-size: 15px;
}

button {
  font-weight: bold;
  width: 30px;
  height: 40px;
  font-size: 16px;
}

#login-button {
  background-color: var(--accent);
  color: var(--background);
  width: 100%;
}

#register-button {
  background-color: var(--objects);
  color: var(--accent);
  border: 2px solid var(--accent);
  width: 100%;
}

label {
  font-weight: bold;
  font-size: 16px;
}

img {
  width: 400px;
}
</style>