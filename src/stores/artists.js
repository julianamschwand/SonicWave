import { defineStore } from "pinia"
import { useSongStore } from "./songs"
import { allArtists, editArtist, singleArtist } from "@/api/routes/artists.js"

export const useArtistStore = defineStore("artists", {
  state: () => ({
    artists: [],
    artistsLoading: true
  }),
  actions: {
    async getArtists() {
      const songStore = useSongStore()
      if (!songStore.songs.length) await songStore.getSongs()

      const response = await allArtists() 

      if (response.success) {
        this.artists = response.artists
        this.artistsLoading = false
      }

      return response
    },
    async getSingleArtist(artistId) {
      if (!this.artists.length) await this.getArtists()
      const response = await singleArtist(artistId)
      
      if (response.success) {
        const artist = response.artist

        const songStore = useSongStore()
        artist.songs = songStore.formatSongs(artist.songs)
        const updates = new Map(artist.songs.map(song => [song.songId, song]))
        songStore.songs = songStore.songs.map(song => updates.get(song.songId) || song)
        
        artist.songs = artist.songs.map(song => song.songId)
        const artistIndex = this.artists.findIndex(artist => artist.artistId == artistId)
        if (artistIndex === -1) this.artists.push(artist)
        else this.artists[artistIndex] = artist
      }

      return response
    },
    async editArtist(artistId, name, description, image) {
      const response = await editArtist(artistId, name, description, image)

      if (response.success) {
        const artist = this.artists.find(artist => artist.artistId == artistId)

        if (name) artist.name = name
        if (description) artist.description = description
      }

      return response
    }
  }
})