<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import router from '@/router'
import PlaylistItem from '@/components/PlaylistItem.vue'
import ArtistItem from '@/components/ArtistItem.vue'
import { useUserStore } from '@/stores/user.js'
import { useQueueStore } from '@/stores/queue.js'
import { useSongStore } from '@/stores/songs.js'
import { usePlaylistStore } from '@/stores/playlists.js'
import { useArtistStore } from '@/stores/artists'
import PlayButton from '@/components/PlayButton.vue'

const songContainerRef = ref(null)
const playlistContainerRef = ref(null)
const artistContainerRef = ref(null)
const songPageIndex = ref(0)
const playlistPageIndex = ref(0)
const artistPageIndex = ref(0)
const userStore = useUserStore()
const queueStore = useQueueStore()
const songStore = useSongStore()
const playlistStore = usePlaylistStore()
const artistStore = useArtistStore()
const songs = ref(songStore.getRecentlyPlayed)
let isScrolling = false

const playlists = computed(() => {
  const playlists = [...playlistStore.playlists]
  
  const fillerPlaylistCount = 10 - (playlists.length % 10 || 10)

  for (let i = 0; i < fillerPlaylistCount; i++) {
    playlists.push({playlistId: 0, name: "", songCount: 0, playlistDuration: 0})
  }

  return playlists
})

const artists = computed(() => {
  const artists = [...artistStore.artists]
  
  const fillerPlaylistCount = 10 - (artists.length % 10 || 10)

  for (let i = 0; i < fillerPlaylistCount; i++) {
    artists.push({artistId: 0, name: ""})
  }

  return artists
})

const scroll = (container, direction) => {
  if (isScrolling) return

  let refContainer = null
  let index = null
  let scrollWidth = null
  if (container === "songs") {
    refContainer = songContainerRef
    index = songPageIndex
    scrollWidth = refContainer.value.clientWidth
  } else if (container === "playlists") {
    refContainer = playlistContainerRef
    index = playlistPageIndex
    scrollWidth = refContainer.value.clientWidth + 10
  } else if (container === "artists") {
    refContainer = artistContainerRef
    index = artistPageIndex
    scrollWidth = refContainer.value.clientWidth + 20
  } 

  if (direction === "left") {
    refContainer.value.scrollBy({left: -scrollWidth, behavior: "smooth"})
    index.value--
  } else if (direction === "right") {
    refContainer.value.scrollBy({left: scrollWidth, behavior: "smooth"})
    index.value++
  } 

  isScrolling = true
  setTimeout(() => {
    isScrolling = false
  }, 500)
}

const playSong = async (song) => {
  if (song.songId === 0) return

  await queueStore.initQueue([song])
}

onBeforeMount(async () => {
  await userStore.updateLogin()
  if (!userStore.loggedIn) router.push("/welcome")
})

onMounted(async () => {
  await Promise.all([
    songStore.fetchRecentlyPlayed(),
    playlistStore.getPlaylists(),
    artistStore.getArtists()
  ])
})
</script>
<template>
  <div class="main-container" v-if="songStore.songsLoading || playlistStore.playlistsLoading || artistStore.artistsLoading">
    <div class="loader-request"></div>
  </div>
  <div id="site-layout" v-else>
    <section v-if="songs().length">
      <div>Recently Played</div>
      <div id="song-container" ref="songContainerRef">
        <div v-for="song in songs()" :style="{ 'visibility': song.songId == 0 ? 'hidden' : 'visible'}" @click="playSong(song)">
          <img :src="song.cover" alt="">
          <div>
            <div>
              <div>{{ song.title }}</div>
              <div>{{ song.artists.map(artist => artist.name).join(", ") || "(None)" }}</div>
            </div>
            <PlayButton :size="50" :songId="song.songId"/>
          </div>
        </div>
      </div>
      <div class="scroll-container" v-if="songs().length > 8" >
        <button class="icon-button" :class="{ 'disabled-button': songPageIndex === 0 }" @click="scroll('songs', 'left')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
          </svg>
        </button>
        <button class="icon-button" :class="{ 'disabled-button': songPageIndex === songs().length / 8 - 1}" @click="scroll('songs', 'right')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
          </svg>
        </button>
      </div>
    </section>
    <section v-if="playlists.length">
      <div>Playlists</div>
      <div id="playlist-container" ref="playlistContainerRef">
        <div v-for="playlist of playlists" :style="{ 'visibility': playlist.playlistId == 0 ? 'hidden' : 'visible'}">
          <PlaylistItem :playlist="playlist" @click="router.push(`/playlists/${playlist.playlistId}`)"/>
        </div>
      </div>
      <div class="scroll-container" v-if="playlists.length > 10">
        <button class="icon-button" :class="{ 'disabled-button': playlistPageIndex === 0 }" @click="scroll('playlists', 'left')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
          </svg>
        </button>
        <button class="icon-button" :class="{ 'disabled-button': playlistPageIndex === playlists.length / 10 - 1 }" @click="scroll('playlists', 'right')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
          </svg>
        </button>
      </div>
    </section>
    <section v-if="artists.length">
      <div>Artists</div>
      <div id="artist-container" ref="artistContainerRef">
        <div v-for="artist of artists" :style="{ 'visibility': artist.artistId == 0 ? 'hidden' : 'visible'}">
          <ArtistItem :artist="artist" @click="router.push(`/artist/${artist.artistId}`)"/>
        </div>
      </div>
      <div class="scroll-container" v-if="artists.length > 10">
        <button class="icon-button" :class="{ 'disabled-button': artistPageIndex === 0 }" @click="scroll('artists', 'left')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
          </svg>
        </button>
        <button class="icon-button" :class="{ 'disabled-button': artistPageIndex === artists.length / 10 - 1 }" @click="scroll('artists', 'right')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
          </svg>
        </button>
      </div>
    </section>
  </div>
</template>
<style lang="scss" scoped>
section {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;

  > div:first-child {
    font-size: 27px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}

#site-layout {
  display: flex;
  gap: 20px;
  flex-direction: column;
  box-sizing: border-box;
}

#song-container {
  display: grid;
  height: 160px;
  grid-auto-flow: column;
  grid-template-rows: 80px 80px;
  grid-auto-columns: 25%;
  width: 100%;
  overflow-x: hidden;

  > div {
    display: flex;
    gap: 10px;
    padding: 10px;
    height: 80px;
    box-sizing: border-box;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: var(--objects);

      > div > div:last-child {
        display: flex;
      }
    }

    img {
      height: 60px;
      width: 60px;
      flex-shrink: 0;
      border-radius: 5px;
    }

    > div {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      flex-grow: 1;
      min-width: 0;

      > div:not(:last-child) {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        min-width: 0;
        
        > div {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        > div:first-child {
          font-weight: bold;
          font-size: 16px;
        }
        
        > div:last-child {
          font-size: 14px;
        }
      }
      
      > div:last-child {
        display: none;
      }
    }
  }
}

.scroll-container {
  display: flex;
  width: 100%;
  justify-content: space-between;

  svg {
    width: 30px;
    height: 30px;
  }
}

#playlist-container {
  display: flex;
  gap: 10px;
  max-width: 100%;
  overflow-x: hidden;

  > div {
    width: calc(100% / 10 - (9 * 10px) / 10);
    flex: 0 0 auto;
  } 
}

#artist-container {
  display: flex;
  gap: 20px;
  max-width: 100%;
  overflow-x: hidden;

  > div {
    width: calc(100% / 10 - (9 * 20px) / 10);
    flex: 0 0 auto;
  }
  
}
</style>