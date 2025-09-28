import { defineStore } from 'pinia'
import { setQueue, clearQueue, getQueue, changeSong } from '@/api/routes/queue.js'
import { useSongStore } from './songs.js'

export const useQueueStore = defineStore("queue", {
  state: () => ({
    queue: [],
    queueIndex: null,
    songIsPlaying: false
  }),
  actions: {
    async initQueue(queue, queueIndex = 0) {
      if (queue[0].songId) queue = queue.map(song => song.songId)
      this.queue = queue
      this.queueIndex = queueIndex
      
      const response = await setQueue(queue)
      
      useSongStore().updateRecentSongs()

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
      this.queue = []
      const response = await clearQueue()

      return response
    },
    clearLocalQueue() {
      this.queue = []
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
      useSongStore().updateRecentSongs()

      const response = await changeSong(action)
      if (!response.success) {
        this.queueIndex -= incrementValue
      }

      return response
    },
    songPlaying(songId) {
      if (this.queue) return this.queue[this.queueIndex] == songId && this.songIsPlaying
      return false
    }
  }
})