<script setup>
import { useUserStore } from '@/stores/user.js'
import { onMounted, onBeforeMount, ref } from 'vue'
import { changePassword } from '@/api/routes/users.js'
import { parseNull } from '@/functions.js'

const userStore = useUserStore()
const selectedPage = ref("accountInfo")
const oldPassword = ref("")
const newPassword = ref("")
const confirmNewPassword = ref("")
const passwordErrorMessage = ref("")
const passwordSuccessMessage = ref("")
const backgroundColor = ref("")
const objectsColor = ref("")
const accentColor = ref("")

const handleChangePassword = async () => {
  if (newPassword.value !== confirmNewPassword.value) {
    passwordErrorMessage.value = "New Passwords are not the same"
    return
  }

  const response = await changePassword(null, oldPassword.value, newPassword.value)

  if (response.success) {
    passwordErrorMessage.value = ""
    passwordSuccessMessage.value = response.message
  } else {
    passwordSuccessMessage.value = ""
    passwordErrorMessage.value = response.message
  }
}

const saveColors = () => {
  localStorage.setItem("backgroundColor", backgroundColor.value)
  localStorage.setItem("objectsColor", objectsColor.value)
  localStorage.setItem("accentColor", accentColor.value)

  document.documentElement.style.setProperty("--background", backgroundColor.value)
  document.documentElement.style.setProperty("--objects", objectsColor.value)
  document.documentElement.style.setProperty("--accent", accentColor.value)
}

onBeforeMount(async () => {
  await userStore.checkLogin()
})

onMounted(async () => {
  await userStore.fetchUserData()

  backgroundColor.value =  parseNull(localStorage.getItem("backgroundColor")) || "#00172b"
  objectsColor.value = parseNull(localStorage.getItem("objectsColor")) || "#002646"
  accentColor.value = parseNull(localStorage.getItem("accentColor")) || "#2ab9d2"
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
      <div class="site-content" v-if="selectedPage === 'accountInfo'">
        <div>Account Info</div>
        <table>
          <tbody>
            <tr>
              <td>User Id:</td>
              <td>{{ userStore.userDataId }}</td>
            </tr>
            <tr>
              <td>Username:</td>
              <td>{{ userStore.username }}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{{ userStore.email }}</td>
            </tr>
            <tr>
              <td>User Role:</td>
              <td>{{ userStore.userRole }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="site-content" v-if="selectedPage === 'password'">
        <div>Password</div>
        <form @submit.prevent="handleChangePassword">
          <label for="old-password">Old Password:</label>
          <input type="password" id="old-password" placeholder="Old Password ..." v-model="oldPassword">
          <label for="new-password">New Password:</label>
          <input type="password" id="new-password" placeholder="New Password ..." v-model="newPassword">
          <label for="confirm-new-password">Confirm New Password:</label>
          <input type="password" id="confirm-new-password" placeholder="Confirm New Password ..." v-model="confirmNewPassword">
          <div class="error-message" v-if="passwordErrorMessage">{{ passwordErrorMessage }}</div>
          <div class="success-message" v-if="passwordSuccessMessage">{{ passwordSuccessMessage }}</div>
          <button type="submit" class="button-dark-hover">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/>
            </svg>
            Change Password
          </button>
        </form>
      </div>
      <div class="site-content" v-if="selectedPage === 'customize'">
        <div>Customize</div>
        <div id="customize-container">
          <div>
            <div :style="{ backgroundColor: backgroundColor }"></div>
            <input type="text" placeholder="Background Color ..." v-model="backgroundColor">
            <button class="button-dark-hover" @click="backgroundColor = '#00172b'">Reset to default</button>
            <div :style="{ backgroundColor: objectsColor }"></div>
            <input type="text" placeholder="Object Color ..." v-model="objectsColor">
            <button class="button-dark-hover" @click="objectsColor = '#002646'">Reset to default</button>
            <div :style="{ backgroundColor: accentColor }"></div>
            <input type="text" placeholder="Accent Color ..." v-model="accentColor">
            <button class="button-dark-hover" @click="accentColor = '#2ab9d2'">Reset to default</button>
          </div>
          <button class="button-dark-hover" @click="saveColors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/>
            </svg>
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#split-container {
  width: 100%;
  height: 100%;
  display: flex;

  > div {
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
  }

  > div:first-child {
    min-width: 250px;
    border-right: 3px solid var(--objects);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    button {
      width: 100%;
      height: 50px;
      background-color: var(--background);
      gap: 10px;
      font-size: 16px;
    }

    svg {
      height: 30px;
      width: 30px;
      fill: white;
    }

    button:hover:not(.risky-action-button) {
      filter: brightness(1.25);
    }
  }

  > div:last-child {
    width: 100%;
  }
}

.risky-action-button {
  color: rgb(215, 36, 36);
  font-weight: bold;

  &:hover {
    background-color: rgb(58, 23, 23) !important;
  }

  svg {
    fill: rgb(215, 36, 36) !important;
  }
}

.selected-page {
  background-color: var(--objects) !important;
}

.site-content {
  > div:first-child {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 20px;

    * {
      font-size: 15px;
    }
  }

  > div:last-child {
    display: flex;
    flex-direction: column;
  }

  table {
    font-size: 15px;

    tr {
      > td:first-child {
        font-weight: bold;
      }

      > td:last-child {
        padding-left: 20px;
      }
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 500px;
  }

  label {
    font-weight: bold;
    font-size: 15px;
  } 

  input {
    background-color: var(--objects);
    border: none;
    border-radius: 5px;
    padding: 10px;
    font-size: 15px;
    height: 40px;
    box-sizing: border-box;
  }

  button {
    background-color: var(--accent);
    color: var(--background);
    height: 40px;
    font-weight: bold;
    width: 100%;
    gap: 5px;

    svg {
      width: 25px;
      height: 25px;
      fill: var(--background);
    }
  }
}

#customize-container {
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  > div {
    display: grid;
    grid-template-columns: 40px auto 150px;
    grid-template-rows: auto;
    gap: 10px;
    width: 100%;

    div {
      height: 40px;
      width: 40px;
      border: 2px solid white;
      border-radius: 5px;
      box-sizing: border-box;
    }

    button {
      width: 150px;
    }
  }
}
</style>