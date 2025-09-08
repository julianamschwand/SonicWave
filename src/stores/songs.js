import { defineStore } from 'pinia'
import { formatDuration } from '@/functions.js'
import { deleteSong, editSong, getSongs, singleSong, toggleFavorite, recentlyPlayed } from '@/api/routes/songs.js'
import { useQueueStore } from './queue.js'

export const useSongStore = defineStore("songs", {
  state: () => ({
    songs: [],
    recentlyPlayedSongs: null,
    songsLoading: true,
    recentLoading: true
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
        const song = response.song
        song.duration = formatDuration(song.duration)
        song.isVisible = true

        const songIndex = this.songs.findIndex(song => song.songId == songId)
        this.songs[songIndex] = { songId: this.songs[songIndex].songId, ...song}
      }

      return response
    },
    async deleteSong(songId) {
      const song = this.songs.find(song => song.songId == songId)
      song.isVisible = false

      const response = await deleteSong(songId)

      if (response.success) this.songs = this.songs.filter(song => song.songId !== songId)
      else song.isVisible = true
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
    async fetchRecentlyPlayed() {
      if (!this.songs.length) await this.getSongs()

      const response = await recentlyPlayed()

      if (response.success) {
        const songs = this.formatSongs(response.songs)

        for (const song of songs) {
          const songIndex = this.songs.findIndex(currentSong => currentSong.songId == song.songId)
          this.songs[songIndex] =  song
        }

        this.recentlyPlayedSongs = response.songs.map(song => song.songId)
        this.addFillerSongs()

        this.recentLoading = false
      }

    
      return response
    },
    getRecentlyPlayed() {
      if (!this.recentlyPlayedSongs) return []
      return this.recentlyPlayedSongs.map(recentSong => this.songs.find(song => song.songId == recentSong) || {songId: 0, artists: []})
    },
    addFillerSongs() {
      const fillerSongCount = 8 - (this.recentlyPlayedSongs.length % 8 || 8)

      for (let i = 0; i < fillerSongCount; i++) {
        this.recentlyPlayedSongs.push(0)
      }
    },
    updateRecentSongs() {
      const queueStore = useQueueStore()
      const newSong = queueStore.queue[queueStore.queueIndex]
            
      const songInRecent = this.recentlyPlayedSongs.findIndex(song => song == newSong)
      if (songInRecent > 0) this.recentlyPlayedSongs.splice(songInRecent, 1)
      this.recentlyPlayedSongs = this.recentlyPlayedSongs.filter(song => song !== 0)

      this.recentlyPlayedSongs.unshift(newSong)
      if (this.recentlyPlayedSongs.length > 20) this.recentlyPlayedSongs.pop()
      this.addFillerSongs()
    },
    formatSongs(songs) {
      return songs.map(song => {
        song.duration = formatDuration(song.duration)
        song.isVisible = true
        return song
      })
    }
  }
})