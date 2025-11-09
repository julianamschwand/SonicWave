<script setup>
import router from '@/router'
import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { usePlaylistStore } from '@/stores/playlists'
import { useSongStore } from '@/stores/songs'
import SongTable from '@/components/SongTable.vue'

const route = useRoute()
const playlistStore = usePlaylistStore()
const songStore = useSongStore()
const query = ref("")
const songs = ref([])
const checkedSongs = ref([])
const playlistSongIds = ref(null)

const filteredSongs = computed(() => {
  return songs.value.filter(song => {
    const songData = `${song.title} ${song.artists.map(artist => artist = artist.name).join(" ")} ${song.genre}`.toLowerCase()
    const queryIncluded = query.value.split(" ").every(word => songData.includes(word.toLowerCase()))
    return queryIncluded
  })
})

const handleAddToPlaylist = async () => {
  if (!checkedSongs.value.length) return

  const response = await playlistStore.addToPlaylist(route.params.id, checkedSongs.value)
  if (response.success) {
    router.push(`/playlists/${route.params.id}`)
  }
}

const toggleSong = (songId) => {
  if (checkedSongs.value.includes(songId)) {
    checkedSongs.value = checkedSongs.value.filter(id => id !== songId)
  } else {
    checkedSongs.value.push(songId)
  }
}

onMounted(async () => {
  if (!playlistStore.playlists.length) await playlistStore.getPlaylists()
  if (!songStore.songs.length) await songStore.getSongs()
  playlistSongIds.value = new Set(playlistStore.playlists.find(playlist => playlist.playlistId == route.params.id).songs)
  songs.value = songStore.songs.filter(song => !playlistSongIds.value.has(song.songId)) 
})
</script>
<template>
  <header>
    Add Songs to Playlist
    <div class="search-container">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF">
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
        </svg>
      </div>
      <div>
        <input type="text" placeholder="Search for something ..." v-model="query">
      </div>
    </div>
  </header>
  <div id="table-container" v-if="filteredSongs.length && !songStore.loading">
    <SongTable 
      :songs="songs" 
      :enableSelect="true" 
      :checkedSongs="checkedSongs" 
      :enabledComponents="['artists','genre','releaseYear','duration']" 
      @toggleSong="toggleSong"
    />
  </div>
  <div class="main-container" v-else>
    <div class="loader-request" v-if="songStore.songsLoading"></div>
    <div v-else>
      <div v-if="!songs.length && !playlistSongIds?.size">No songs have been added yet</div>
      <div v-if="!songs.length && playlistSongIds?.size">All songs have already been added to the playlist</div>
      <div v-if="songs.length && !filteredSongs.length">{{ `No results for "${query}"` }}</div>
    </div>
  </div>
  <div id="button-container">
    <button class="button-dark-hover" @click="router.push(`/playlists/${route.params.id}`)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
      </svg>
      Cancel
    </button>
    <button class="button-dark-hover" @click="handleAddToPlaylist">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/>
      </svg>
      Save
    </button>
  </div>
</template>
<style lang="scss" scoped>
.search-container * {
  background-color: var(--objects);
}

#button-container {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: space-between;

  button {
    background-color: var(--accent);
    height: 40px;
    width: 200px;
    color: var(--background);
    font-weight: bold;
    font-size: 18px;
    gap: 5px;
  }

  svg {
    fill: var(--background);
    width: 25px;
    height: 25px;
  }
}

.main-container {
  font-size: 25px;
}

#table-container {
  height: 100%;
  max-height: 100%;
  overflow: auto;
}
</style>