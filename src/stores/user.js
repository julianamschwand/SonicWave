import { userdata, login, logout, loginState, deleteUser } from '@/api/routes/users'
import { defineStore } from 'pinia'
import router from '@/router'
import { useQueueStore } from './queue.js'

export const useUserStore = defineStore("user", {
  state: () => ({
    loggedIn: false,
    userDataId: 0,
    username: "",
    email: "",
    userRole: ""
  }),
  actions: {
    async login(username, email, password) {
      const response = await login(username, email, password)
      if (response.success) {
        this.loggedIn = true

        const queueStore = useQueueStore()
        await queueStore.loadQueue()
        await this.fetchUserData()

        router.push("/")
      }

      return response
    },
    async fetchUserData() {
      if (this.loggedIn) {
        const response = await userdata()

        if (response.success) {
          this.userDataId = response.user.userDataId
          this.username = response.user.username
          this.email = response.user.email
          this.userRole = response.user.userRole
        }

        return response
      }
    },
    async updateLogin() {
      const response = await loginState()
      if (response.success) {
        this.loggedIn = response.loggedIn

        if (!this.loggedIn) {
          this.userDataId = 0
          this.username = ""
          this.email = ""
          this.userRole = ""
        }
      }

      return response
    },
    async checkLogin() {
      const response = await this.updateLogin()

      if (!this.loggedIn) router.push("/login")

      return response
    },
    async logout() {
      const response = await logout()
      if (response.success) {
        this.loggedIn = false
        this.userDataId = 0
        this.username = ""
        this.email = ""
        this.userRole = ""

        const queueStore = useQueueStore()
        queueStore.clearLocalQueue()

        router.push("/welcome")
      }

      return response
    },
    async deleteUser(userDataId) {
      const response = await deleteUser(userDataId)
      if (response.success) {
        await this.logout()
      }

      return response
    }
  }
})