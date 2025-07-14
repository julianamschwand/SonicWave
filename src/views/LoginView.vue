<script setup>
import { useRouter } from 'vue-router'
import { login } from '@/api/routes/user-routes'
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
          <div id="error-message" v-if="errorMessage">{{ errorMessage }}</div>
          <button type="submit" class="button button-dark-hover" id="login-button">Login</button>
          <button class="button button-dark-hover" id="register-button" @click="router.push('/register')">Register</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
.main-container {
  height: calc(100% - calc(var(--ui-scale) * 0.4));
}

#login-container {
  display: flex;
  background-color: var(--objects);
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: calc(var(--ui-scale) * 0.2);
  border-radius: calc(var(--ui-scale) * 0.1);
}

#center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(var(--ui-scale) * 0.3)
}

form {
  display: flex;
  flex-direction: column;
  gap: calc(var(--ui-scale) * 0.1)
}

input {
  background-color: var(--background);
  outline: none;
  border: none;
  padding: calc(var(--ui-scale) * 0.1);
  border-radius: calc(var(--ui-scale) * 0.05);
  font-size: calc(var(--ui-scale) * 0.15);
}

.button {
  font-weight: bold;
  width: calc(var(--ui-scale) * 3);
  height: calc(var(--ui-scale) * 0.4);
  font-size: calc(var(--ui-scale) * 0.16);
}

#login-button {
  background-color: var(--accent);
  color: var(--background);
}

#register-button {
  background-color: var(--objects);
  color: var(--accent);
  border: calc(var(--ui-scale) * 0.02) solid var(--accent);
}

#back-button {
  width: calc(var(--ui-scale));
  background-color: var(--accent);
  color: var(--background);
}

label {
  font-weight: bold;
}

img {
  width: calc(var(--ui-scale) * 4)
}

#error-message {
  color: red;
}
</style>