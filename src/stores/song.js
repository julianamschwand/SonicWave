import { defineStore } from 'pinia'

export const useSongStore = defineStore('song', {
  state: () => ({
    songUrl: null,
    songData: null
  }),
  actions: {
    setSong(song) {
      this.songUrl = `${import.meta.env.VITE_API_URL}/songs/play?songId=${song.songId}`
      this.songData = song
    },
    clearSong() {
      this.songUrl = null
      this.songData = null
    }
  }
})