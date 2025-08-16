import { defineStore } from 'pinia'
import { setQueue, clearQueue, getQueue, changeSong } from '@/api/routes/queue.js'

export const useQueueStore = defineStore("queue", {
  state: () => ({
    queue: null,
    queueIndex: null
  }),
  actions: {
    async initQueue(queue, queueIndex = 0) {
      this.queue = queue
      this.queueIndex = queueIndex
      
      const idQueue = queue.map(song => song.songId)
      const response = await setQueue(idQueue)

      return response
    },
    async loadQueue() {
      const response = await getQueue()
      if (response.success) {
        this.queue = response.queue
        this.queueIndex = response.queueIndex
      }

      return response
    },
    async clearQueue() {
      this.queue = null
      const response = await clearQueue()

      return response
    },
    clearLocalQueue() {
      this.queue = null
    },
    async changeSong(action) {
      let incrementValue = 0
      if (action === "forward") {
        if (this.queueIndex === this.queue.length - 1) return
        incrementValue = 1
      } else {
        if (this.queueIndex === 0) return
        incrementValue = -1
      }

      this.queueIndex += incrementValue

      const response = await changeSong(action)
      if (!response.success) {
        this.queueIndex -= incrementValue
      }

      return response
    }
  }
})