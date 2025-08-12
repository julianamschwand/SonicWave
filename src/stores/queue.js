import { defineStore } from 'pinia'
import { setQueue, clearQueue, getQueue } from '@/api/routes/queue.js'
import { changeSong } from '@/api/routes/queue.js'

export const useQueueStore = defineStore('song', {
  state: () => ({
    queue: null,
    queueIndex: null
  }),
  actions: {
    async initQueue(queue, queueIndex = 0) {
      this.queue = queue
      this.queueIndex = queueIndex
      
      const idQueue = queue.map(song => song.songId)
      await setQueue(idQueue)
    },
    async loadQueue() {
      const queueResponse = await getQueue()
      if (queueResponse.success) {
        this.queue = queueResponse.queue
        this.queueIndex = queueResponse.queueIndex
      }
    },
    async clearQueue() {
      this.queue = null
      await clearQueue()
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
    }
  }
})