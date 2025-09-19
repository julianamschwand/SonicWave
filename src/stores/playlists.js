import { defineStore } from "pinia"
import { addToPlaylist, allPlaylists, createPlaylist, deleteFromPlaylist, deletePlaylist, editPlaylist, singlePlaylist } from "@/api/routes/playlists.js"
import { useSongStore } from "./songs.js"
import router from "@/router"

export const usePlaylistStore = defineStore("playlists", {
  state: () => ({
    playlists: [],
    playlistsLoading: true
  }),
  actions: {
    async getPlaylists() {
      const response = await allPlaylists()
      if (response.success) {
        this.playlists = response.playlists
        this.playlistsLoading = false
      }

      return response
    },
    async getSinglePlaylist(playlistId) {
      if (!this.playlists.length) await this.getPlaylists()
      const response = await singlePlaylist(playlistId)
      if (response.success) {
        const playlist = response.playlist
        
        const songStore = useSongStore()
        playlist.songs = songStore.formatSongs(playlist.songs)
        const updates = new Map(playlist.songs.map(song => [song.songId, song]))
        songStore.songs = songStore.songs.map(song => updates.get(song.songId) || song)
        
        playlist.songs = playlist.songs.map(song => song.songId)
        const playlistIndex = this.playlists.findIndex(playlist => playlist.playlistId == playlistId)
        this.playlists[playlistIndex] = playlist
      }

      return response
    },
    async addToPlaylist(playlistId, songIds) {
      const response = await addToPlaylist(playlistId, songIds)

      if (response.success) {
        const playlist = this.playlists.find(playlist => playlist.playlistId == playlistId)
        playlist.songs = [...playlist.songs, ...songIds]
        playlist.songCount += songIds.length

        const songStore = useSongStore()
        playlist.playlistDuration += songIds.reduce((acc, songId) => acc + songStore.songs.find(song => song.songId == songId).duration, 0)
      }

      return response
    },
    async deleteFromPlaylist(playlistId, songId) {
      const song = useSongStore().songs.find(song => song.songId == songId)
      const playlist = this.playlists.find(playlist => playlist.playlistId == playlistId)
      song.isVisible = false
      playlist.songCount -= 1
      playlist.playlistDuration -= song.duration

      const response = await deleteFromPlaylist(playlistId, songId)

      if (response.success) {
        playlist.songs = playlist.songs.filter(song => song != songId)
      } else {
        playlist.songCount += 1
        song.isVisible = true
        playlist.playlistDuration += song.duration
      }

      return response
    },
    async deletePlaylist(playlistId) {
      const response = await deletePlaylist(playlistId)

      if (response.success) {
        this.playlists = this.playlists.filter(playlist => playlist.playlistId != playlistId)
        router.push("/playlists")
      }

      return response
    },
    async editPlaylist(playlistId, name, description, cover) {
      const response = await editPlaylist(playlistId, name, description, cover)

      if (response.success) {
        const playlist = this.playlists.find(playlist => playlist.playlistId == playlistId)

        if (name) playlist.name = name
        if (description) playlist.description = description
      }

      return response
    },
    async createPlaylist(name, description, cover) {
      const response = await createPlaylist(name, description, cover)

      if (response.success) {
        this.playlists.push(response.playlist)
        this.playlists.sort((a, b) => a.name.localeCompare(b.name))
      }

      return response
    }
  }
})