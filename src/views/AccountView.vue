<script setup>
import { useUserStore } from '@/stores/user.js'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const selectedPage = ref("accountInfo")

onMounted(async () => {
  await userStore.checkLogin()
  await userStore.fetchUserData()
})
</script>
<template>
  <header>Account</header>
  <div id="split-container">
    <div>
      <div>
        <button :class="{ 'selected-page': selectedPage === 'accountInfo'}" @click="selectedPage = 'accountInfo'">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
          </svg>
          Account Info
        </button>
        <button :class="{ 'selected-page': selectedPage === 'password'}" @click="selectedPage = 'password'">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M280-400q-33 0-56.5-23.5T200-480q0-33 23.5-56.5T280-560q33 0 56.5 23.5T360-480q0 33-23.5 56.5T280-400Zm0 160q-100 0-170-70T40-480q0-100 70-170t170-70q67 0 121.5 33t86.5 87h352l120 120-180 180-80-60-80 60-85-60h-47q-32 54-86.5 87T280-240Zm0-80q56 0 98.5-34t56.5-86h125l58 41 82-61 71 55 75-75-40-40H435q-14-52-56.5-86T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z"/>
          </svg>
          Password
        </button>
        <button :class="{ 'selected-page': selectedPage === 'customize'}" @click="selectedPage = 'customize'">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M240-120q-45 0-89-22t-71-58q26 0 53-20.5t27-59.5q0-50 35-85t85-35q50 0 85 35t35 85q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 23-5.5 42T220-202q5 2 10 2h10Zm230-160L360-470l358-358q11-11 27.5-11.5T774-828l54 54q12 12 12 28t-12 28L470-360Zm-190 80Z"/>
          </svg>
          Customize
        </button>
      </div>
      <div>
        <button class="risky-action-button" @click="userStore.logout">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
          </svg>
          Logout
        </button>
        <button class="risky-action-button"  v-if="userStore.userRole !== 'owner'" @click="userStore.deleteUser(userStore.userDataId)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
          </svg>
          Delete Account
        </button>
      </div>
    </div>
    <div>

    </div>
  </div>
</template>
<style scoped>
#split-container {
  width: 100%;
  height: 100%;
  display: flex;
}

#split-container > div {
  height: 100%;
  box-sizing: border-box;
}

#split-container > div:first-child {
  min-width: 250px;
  border-right: 3px solid var(--objects);
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

#split-container > div:first-child button {
  width: 100%;
  height: 50px;
  background-color: var(--background);
  gap: 10px;
}

#split-container > div:first-child button:hover:not(.risky-action-button) {
  filter: brightness(1.25);
}

#split-container > div:first-child svg {
  height: 30px;
  width: 30px;
  fill: white;
}

#split-container > div:last-child {
  width: 100%;
}

.risky-action-button {
  color: rgb(215, 36, 36);
  font-weight: bold;
}

.risky-action-button svg {
  fill: rgb(215, 36, 36) !important;
}

.risky-action-button:hover {
  background-color: rgb(58, 23, 23) !important;
}

.selected-page {
  background-color: var(--objects) !important;
}
</style>