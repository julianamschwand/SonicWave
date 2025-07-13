<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
  <div id="navbar">
    <img src="/images/logo.png" alt="SonicWave" id="logo" @click="router.push('/')">
    <div id="search-container">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFF">
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
        </svg>
      </div>
      <div>
        <input type="text" placeholder="Search for something ...">
      </div>
    </div>
    <div id="login-button" class="button">
      Login
    </div>
  </div>
  <div id="seperator"></div>
</template>
<style scoped>
#navbar {
  height: 65px;
  width: 100%;
  background-color: var(--objects);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
}

#seperator {
  height: 5px;
  width: 100%;
  background-color: var(--accent);
}

#logo {
  max-height: 40px;
  cursor: pointer;
}

#search-container {
  width: 350px;
  display: flex;
  align-items: center;
  gap: 3px;
}

#search-container * {
  background-color: var(--background);
  color: white;
  border: none;
  outline: none;
  font-size: 16px;
}

#search-container div:first-child {
  justify-content: center;
  border-radius: 0px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  max-width: 40px;
  padding: 0px;
}

#search-container div {
  display: flex;
  align-items: center;
  height: 40px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  width: calc(100% - 45px);
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
}

#search-container input {
  width: 100%;
}

#login-button {
  height: 40px;
  width: 100px;
  border-radius: 5px;
  background-color: var(--accent);
  color: var(--background);
  font-weight: bold;
}
</style>