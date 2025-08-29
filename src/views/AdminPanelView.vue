<script setup>
import router from '@/router'
import { registerRequests, allUsers, approveRegister, denyRegister, makeAdmin, removeAdmin, deleteUser } from '@/api/routes/users.js'
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()
const requests = ref([])
const users = ref([])
const isOwner = ref(false)
const loaderVisible = ref(true)

const filteredRequests = computed(() => {
  return requests.value.filter(request => request.visible)
})

const filteredUsers = computed(() => {
  return users.value.filter(user => user.visible)
})

const handleApproveRegister = async (userDataId) => {
  const request = requests.value.find(request => request.userDataId === userDataId)
  request.userRole = "user"
  users.value.push(JSON.parse(JSON.stringify(request)))
  request.visible = false

  const response = await approveRegister(userDataId)

  if (response.success) {
    requests.value = requests.value.filter(request => request.userDataId !== userDataId)
  } else {
    users.value = users.value.filter(user => user.userDataId !== userDataId)
    request.visible = true
  }

}

const handleDenyRegister = async (userDataId) => {
  const request = requests.value.find(request => request.userDataId === userDataId)
  request.visible = false

  const response = await denyRegister(userDataId)

  if (response.success) {
    requests.value = requests.value.filter(request => request.userDataId !== userDataId)
  } else {
    request.visible = true
  }
}

const handleMakeAdmin = async (userDataId) => {
  const user = users.value.find(user => user.userDataId === userDataId)
  user.userRole = "admin"

  const response = await makeAdmin(userDataId)

  if (!response.success) {
    user.userRole = "user"
  }
}

const handleRemoveAdmin = async (userDataId) => {
  const user = users.value.find(user => user.userDataId === userDataId)
  user.userRole = "user"

  const response = await removeAdmin(userDataId)

  if (!response.success) {
    user.userRole = "admin"
  }
}

const handleDeleteUser = async (userDataId) => {
  const user = users.value.find(user => user.userDataId === userDataId)
  user.visible = false

  const response = await deleteUser(userDataId)

  if (response.success) {
    users.value = users.value.filter(user => user.userDataId !== userDataId)
  } else {
    user.visible = true
  }
}

onBeforeMount(async () => {
  await userStore.checkLogin()
})

onMounted(async () => {
  await userStore.fetchUserData()
  if (userStore.userRole !== "admin" && userStore.userRole !== "owner") router.push("/")
  if (userStore.userRole === "owner") isOwner.value = true

  const apiRequests = [registerRequests(), isOwner.value ? allUsers() : Promise.resolve(null)]

  const [requestResponse, usersResponse] = await Promise.all(apiRequests)

  if (requestResponse.success) {
    requests.value = requestResponse.requests.map(request => {
      request.visible = true
      return request
    })
  }

  if (usersResponse?.success) {
    users.value = usersResponse.users.map(user => {
      user.visible = true
      return user
    })
  }

  loaderVisible.value = false
})
</script>
<template>
  <header>
    <div>Register requests</div>
    <div v-if="isOwner">User managment</div>
  </header>
  <div class="main-container" v-if="loaderVisible">
    <div class="loader-request"></div>
  </div>
  <div id="split-container" v-else>
    <div v-if="filteredRequests.length">
      <div v-for="request of filteredRequests">
        <div>{{ request.username }}</div>
        <div>{{ request.email }}</div>
        <div>
          <button class="light-button button-dark-hover" @click="handleApproveRegister(request.userDataId)">
            <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 -960 960 960">
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
          </button>
          <button class="dark-button button-light-hover" @click="handleDenyRegister(request.userDataId)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="center-container">
      No register requests
    </div>
    <div v-if="isOwner && filteredUsers.length">
      <div v-for="user in filteredUsers">
        <div>{{ user.username }}</div>
        <div>{{ user.email }}</div>
        <div>
          <button class="light-button button-dark-hover" v-if="user.userRole !== 'admin'" @click="handleMakeAdmin(user.userDataId)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-14.5t-41-9.5v-147l-240-90-240 90v188q0 47 12.5 94t35 89.5Q310-290 342-254t71 60q11 32 29 61t41 52q-1 0-1.5.5t-1.5.5Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Zm180 334h40v-100h100v-40H700v-100h-40v100H560v40h100v100Z"/>
            </svg>
          </button>
          <button class="dark-button button-light-hover" v-else @click="handleRemoveAdmin(user.userDataId)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="m754-318-60-62q12-32 19-66.5t7-69.5v-189l-240-90-146 55-62-62 208-78 320 120v244q0 51-11.5 101T754-318Zm38 262L662-186q-38 39-84.5 65.5T480-80q-139-35-229.5-159.5T160-516v-172L56-792l56-56 736 736-56 56ZM423-425Zm91-135Zm-34 396q35-11 67-31t59-47L240-608v92q0 121 68 220t172 132Z"/>
            </svg>
          </button>
          <button class="dark-button button-light-hover" @click="handleDeleteUser(user.userDataId)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-if="!filteredUsers.length && isOwner" class="center-container">
      No users other than owner
    </div>
  </div>
</template>
<style lang="scss" scoped>
header {
  justify-content: flex-start;
  gap: 30px;

  div {
    width: 100%;
  }
}

#split-container {
  display: flex;
  width: 100%;
  gap: 30px;
  height: calc(100% - 80px);

  > div {
    width: 100%;

    > div {
      width: 100%;
      display: flex;
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0px;
      }

      > div {
        background-color: var(--objects);
        height: 40px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        width: 100%;

        &:not(:last-child) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &:last-child {
          width: 90px;
          padding: 0px;
          background-color: var(--background);
        }
      }
    }
  }

  > div > div div, button {
    margin-right: 5px;
  }

  > div > div div:last-child, button:last-child {
    margin-right: 0px;
  }
}

button {
  height: 40px;
  width: 40px;
  padding: 0px;

  svg {
    height: 30px;
    width: 30px;
  }
}

.light-button {
  background-color: var(--accent);

  svg {
    fill: var(--background);
  }
}

.dark-button {
  background-color: var(--background);
  border: 2px solid var(--accent);

  svg {
    fill: var(--accent);
  }
}

.center-container {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
</style>