<script setup>
import router from '@/router'
import { register } from '@/api/routes/users'
import { ref } from 'vue'
import BackButton from '@/components/BackButton.vue'

const username = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const errorMessage = ref("")

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords are not the same"
    return
  }

  const response = await register(username.value, email.value, password.value)
  if (response.success) {
    router.push('/')
  } else {
    errorMessage.value = response.message
  }
}
</script>
<template>
  <BackButton @click="router.push('/welcome')"/>
  <div class="main-container">
    <div id="center-container">
      <img src="/images/logo.png" alt="SonicWave">
      <div id="login-container">
        <form @submit.prevent="handleRegister">
          <label for="username">Username:</label>
          <input type="text" id="username" placeholder="Username ..." v-model="username">
          <label for="email">E-Mail Address:</label>
          <input type="email" id="email" placeholder="E-Mail Adress ..." v-model="email">
          <label for="password">Password:</label>
          <input type="password" id="password" placeholder="Password ..." v-model="password">
          <label for="password">Confirm Password:</label>
          <input type="password" id="confirm-password" placeholder="Confirm Password ..." v-model="confirmPassword">
          <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
          <button type="submit" class="button button-dark-hover" id="register-button">Register</button>
          <button class="button button-dark-hover" id="login-button" @click="router.push('/login')">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#login-container {
  display: flex;
  background-color: var(--objects);
  justify-content: center;
  align-items: center;
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

#register-button {
  background-color: var(--accent);
  color: var(--background);
  width: 100%;
}

#login-button {
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