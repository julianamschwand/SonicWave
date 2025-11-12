<script setup>
import router from '@/router'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user.js'
import SearchDropdown from './SearchDropdown.vue'
import Logo from './Logo.vue'
import { useDeviceStore } from '@/stores/device.js'

const userStore = useUserStore()
const deviceStore = useDeviceStore()
const searchQuery = ref("")
const dropdownRef = ref(null)
const searchbarRef = ref(null)
const showDropdown = ref(false)

const handleClick = (event) => {
  if (!searchbarRef.value) return
  const clickedOutsideSearchbar = !searchbarRef.value.contains(event.target)
  const clickedOutsideDropdown = !dropdownRef.value || !dropdownRef.value.$el.contains(event.target)

  if (clickedOutsideSearchbar && clickedOutsideDropdown) {
    showDropdown.value = false
  } else {
    showDropdown.value = true
  }
}

const handleSelectedSearch = (path) => {
  searchQuery.value = ""
  if (path) router.push(path)
}

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClick)
})

onMounted(async () => {
  await userStore.updateLogin()

  if (userStore.loggedIn) {
    await userStore.fetchUserData()
  }

  document.addEventListener("click", handleClick)
})
</script>
<template>
  <div id="navbar">
    <Logo :size="deviceStore.isMobile ? 24 : 26" @click="router.push('/home')"/>
    <div id="navbar-search-container" v-if="!deviceStore.isMobile">
      <div class="search-container">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
          </svg>
        </div>
        <div>
          <input type="text" placeholder="Search for something ..." v-model="searchQuery" ref="searchbarRef" @keydown.escape="showDropdown = false">
        </div>
      </div>
      <SearchDropdown :query="searchQuery" v-if="searchQuery && showDropdown" ref="dropdownRef" @selected="handleSelectedSearch"/>
    </div>
    <button id="login-button" class="button-dark-hover" @click="router.push('/login')" v-if="!userStore.loggedIn">Login</button>
    <button id="account-button" class="button-light-hover" @click="router.push('/account')" v-else>
      {{ userStore.username }}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 20a6 6 0 0 0-12 0"/>
        <circle cx="12" cy="10" r="4"/>
        <circle cx="12" cy="12" r="10"/>
      </svg>
    </button>
  </div>
</template>
<style lang="scss" scoped>
#navbar {
  height: 65px;
  width: 100%;
  background-color: var(--objects);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 5px;
}

#login-button {
  height: 40px;
  width: 100px;
  border-radius: 5px;
  background-color: var(--accent);
  color: var(--background);
  font-weight: bold;
  font-size: 16px;
}

.search-container * {
  background-color: var(--background);
}

#navbar-search-container {
  width: 450px;
  display: flex;
  justify-content: center;

  > div:not(.search-container) {
    position: absolute;
    top: 75px;
  }
}

#logo {
  cursor: pointer;
}

#account-button {
  height: 40px;
  cursor: pointer;
  background-color: var(--objects);
  gap: 10px;
  padding: 10px;
  padding-right: 5px;
  font-size: 14px;
}

#account-button svg{
  width: 30px;
  height: 30px;
  stroke: var(--accent);
}

@media (max-aspect-ratio: 4/3) {
  #navbar {
    height: 55px;
  }
}
</style>