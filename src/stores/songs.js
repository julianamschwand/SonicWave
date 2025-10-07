import { defineStore } from 'pinia'
import { deleteSong, editSong, getSongs, resetSong, singleSong, toggleFavorite } from '@/api/routes/songs.js'
import { useQueueStore } from './queue'

export const useSongStore = defineStore("songs", {
  state: () => ({
    songs: [],
    songsLoading: true
  }),
  actions: {
    async getSongs() {
      const response = await getSongs()
      if (response.success) {
        this.songs = this.formatSongs(response.songs)
        this.songsLoading = false
      }

      return response
    },
    async getSingleSong(songId) {
      if (!this.songs.length) await this.getSongs()
      const response = await singleSong(songId)
    
      if (response.success) {
        const songIndex = this.songs.findIndex(song => song.songId == songId)
        this.songs[songIndex] = this.formatSongs([response.song])[0]
      }

      return response
    },
    async deleteSong(songId) {
      const song = this.songs.find(song => song.songId == songId)
      song.isVisible = false

      const response = await deleteSong(songId)

      if (response.success) {
        const queueStore = useQueueStore()
        const queueSongId = queueStore.queue[queueStore.queueIndex]

        if (queueSongId == songId) {
          if (queueStore.queue.length === 1) {
            queueStore.clearQueue()
          } else {
            if (queueStore.queueIndex === queueStore.queue.length - 1) {
              queueStore.queueIndex--
            }

            queueStore.queue = queueStore.queue.filter(id => id != songId)
          }
        }

        this.songs = this.songs.filter(song => song.songId !== songId)
      } else {
        song.isVisible = true
      } 
    },
    async toggleFavorite(songId) {
      const song = this.songs.find(song => song.songId == songId)
      song.isFavorite = !song.isFavorite

      const response = await toggleFavorite(songId)

      if (!response.success) song.isFavorite = !song.isFavorite
    },
    async editSong(songId, title, artistAdd, artistDelete, genre, releaseYear, cover) {    
      const response = await editSong(songId, title, artistAdd, artistDelete, genre, releaseYear, cover)

      if (response.success) {
        const song = this.songs.find(song => song.songId == songId)

        if (title) song.title = title
        if (genre) song.genre = genre
        if (releaseYear) song.releaseYear = releaseYear
        if (artistDelete.length) song.artists = song.artists.filter(currentArtist => artistDelete.some(deleteArtist => deleteArtist !== currentArtist.name))
        if (artistAdd.length) song.artists = [...song.artists, ...response.newArtists]
      }

      return response
    },
    async updateLastPlayed() {
      if (!this.songs.length) await this.getSongs()

      const queueStore = useQueueStore()
      const songId = queueStore.queue[queueStore.queueIndex]

      const song = this.songs.find(song => song.songId == songId)
      song.lastPlayed = new Date().toISOString()
    },
    async resetSong(songId) {
      const response = await resetSong(songId)

      if (response.success) {
        const songIndex = this.songs.findIndex(song => song.songId == songId)
        this.songs[songIndex] = this.formatSongs([response.song])[0]
      }

      return response
    },
    formatSongs(songs) {
      return songs.map(song => {
        song.isVisible = true
        return song
      })
    }
  }
})