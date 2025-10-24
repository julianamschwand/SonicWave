import { allUsers, approveRegister, denyRegister, makeAdmin, registerRequests, removeAdmin, deleteUser } from '@/api/routes/users'
import { defineStore } from 'pinia'

export const useOtherUsersStore = defineStore("otherUsers", {
  state: () => ({
    registerRequests: [],
    otherUsers: [],
    requestsLoading: true,
    otherUsersLoading: true
  }),
  actions: {
    async getRegisterRequests() {
      const response = await registerRequests()

      if (response.success) {
        this.registerRequests = response.requests.map(request => {
          request.isVisible = true
          return request
        })
        this.requestsLoading = false
      }

      return response
    },
    async getOtherUsers() {
      const response = await allUsers()

      if (response.success) {
        this.otherUsers = response.users.map(user => {
          user.isVisible = true
          return user
        })
        this.otherUsersLoading = false
      }

      return response
    },
    async approveRegister(userDataId) {
      const request = this.registerRequests.find(request => request.userDataId == userDataId)
      request.userRole = "user"
      this.otherUsers.push(JSON.parse(JSON.stringify(request)))
      request.isVisible = false

      const response = await approveRegister(userDataId)

      if (response.success) {
        this.registerRequests = this.registerRequests.filter(request => request.userDataId != userDataId)
      } else {
        this.otherUsers = this.otherUsers.filter(user => user.userDataId != userDataId)
        request.isVisible = true
      }
    },
    async denyRegister(userDataId) {
      const request = this.registerRequests.find(request => request.userDataId == userDataId)
      request.isVisible = false

      const response = await denyRegister(userDataId)

      if (response.success) {
        this.registerRequests = this.registerRequests.filter(request => request.userDataId != userDataId)
      } else {
        request.isVisible = true
      }
    },
    async makeAdmin(userDataId) {
      const user = this.otherUsers.find(user => user.userDataId == userDataId)
      user.userRole = "admin"

      const response = await makeAdmin(userDataId)

      if (!response.success) {
        user.userRole = "user"
      }
    },
    async removeAdmin(userDataId) {
      const user = this.otherUsers.find(user => user.userDataId == userDataId)
      user.userRole = "user"

      const response = await removeAdmin(userDataId)

      if (!response.success) {
        user.userRole = "admin"
      }
    },
    async deleteUser(userDataId) {
      const user = this.otherUsers.find(user => user.userDataId == userDataId)
      user.isVisible = false

      const response = await deleteUser(userDataId)

      if (response.success) {
        this.otherUsers = this.otherUsers.filter(user => user.userDataId != userDataId)
      } else {
        user.isVisible = true
      }
    },
    reset() {
      this.registerRequests = []
      this.otherUsers = []
      this.requestsLoading = true
      this.otherUsersLoading = true
    }
  }
})