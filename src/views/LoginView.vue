<script setup>
import { useRouter } from 'vue-router'
import { login } from '@/api/routes/users'
import { ref } from 'vue'

const router = useRouter()
const email = ref("")
const password = ref("")
const errorMessage = ref("")

const handleLogin = async () => {
  const response = await login(email.value, password.value)
  if (response.success) {
    router.push('/')
  } else {
    errorMessage.value = response.message
  }
}
</script>
<template>
  <div class="button button-dark-hover" id="back-button" @click="router.push('/welcome')">🡰 Back</div>
  <div class="main-container">
    <div id="center-container">
      <img src="/images/logo.png" alt="">
      <div id="login-container">
        <form @submit.prevent="handleLogin">
          <label for="email">E-Mail Address:</label>
          <input type="email" id="email" placeholder="user@example.com" v-model="email">
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
.main-container {
  height: calc(100% - 40px);
}

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

.button {
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

#back-button {
  width: 100px;
  background-color: var(--accent);
  color: var(--background);
}

label {
  font-weight: bold;
  font-size: 16px;
}

img {
  width: 400px;
}
</style>