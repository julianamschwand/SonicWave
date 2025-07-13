<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
  <div id="navbar">
    <img src="/images/logo.png" alt="SonicWave" draggable="false" id="logo" @click="router.push('/')">
    <div id="search-container">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF">
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
        </svg>
      </div>
      <div>
        <input type="text" placeholder="Search for something ...">
      </div>
    </div>
    <div id="login-button" class="button button-dark-hover">
      Login
    </div>
  </div>
  <div id="seperator"></div>
</template>
<style scoped>
#navbar {
  height: calc(var(--ui-scale) * 0.65 - calc(var(--ui-scale) * 0.05));
  width: 100%;
  background-color: var(--objects);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(var(--ui-scale) * 0.08);
  box-sizing: border-box;
}

#seperator {
  height: calc(var(--ui-scale) * 0.05);
  width: 100%;
  background-color: var(--accent);
}

#logo {
  max-height: calc(var(--ui-scale) * 0.4);
  cursor: pointer;
}

#search-container {
  width: calc(var(--ui-scale) * 3.5);
  display: flex;
  align-items: center;
  gap: calc(var(--ui-scale) * 0.03);
}

#search-container * {
  background-color: var(--background);
  color: white;
  border: none;
  outline: none;
  font-size: calc(var(--ui-scale) * 0.15);
}

#search-container div:first-child {
  justify-content: center;
  border-radius: 0px;
  border-top-left-radius: calc(var(--ui-scale) * 0.05);
  border-bottom-left-radius: calc(var(--ui-scale) * 0.05);
  max-width: calc(var(--ui-scale) * 0.4);
  padding: 0px;
}

#search-container div {
  display: flex;
  align-items: center;
  height: calc(var(--ui-scale) * 0.4);
  border-top-right-radius: calc(var(--ui-scale) * 0.05);
  border-bottom-right-radius: calc(var(--ui-scale) * 0.05);
  width: calc(100% - calc(var(--ui-scale) * 0.45));
  box-sizing: border-box;
  padding-left:calc(var(--ui-scale) * 0.1);
  padding-right: calc(var(--ui-scale) * 0.1);
}

#search-container input {
  width: 100%;
}

#login-button {
  height: calc(var(--ui-scale) * 0.4);
  width: var(--ui-scale);
  border-radius: calc(var(--ui-scale) * 0.05);
  background-color: var(--accent);
  color: var(--background);
  font-weight: bold;
  font-size: calc(var(--ui-scale) * 0.16);
}

svg {
  height: calc(var(--ui-scale) * 0.24);
  width: calc(var(--ui-scale) * 0.24);
}
</style>