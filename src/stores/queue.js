import { defineStore } from 'pinia'
import { setQueue, clearQueue, getQueue, changeSong } from '@/api/routes/queue.js'
import { useSongStore } from './songs.js'

export const useQueueStore = defineStore("queue", {
  state: () => ({
    queue: [],
    queueIndex: null,
    songIsPlaying: true
  }),
  actions: {
    async initQueue(queue, queueIndex = 0) {
      if (queue[0].songId) queue = queue.map(song => song.songId)
      this.queue = queue
      this.queueIndex = queueIndex
      
      const response = await setQueue(queue)
      this.songIsPlaying = true
      
      useSongStore().updateRecentSongs()

      return response
    },
    async loadQueue() {
      const response = await getQueue()
      if (response.success) {
        this.queue = response.queue
        this.queueIndex = response.queueIndex
        this.songIsPlaying = true
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
      if (this.queue) return this.queue[this.queueIndex]?.songId == songId && this.songIsPlaying
      return false
    },
    getSong() {
      const songStore = useSongStore()

      if (!songStore.songs.length || !this.queue.length) return {}
      return this.queue.map(queueSong => songStore.songs.find(song => song.songId == queueSong))[this.queueIndex]
    }
  }
})