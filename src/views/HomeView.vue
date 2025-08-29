<script setup>
import { loginState } from '@/api/routes/users.js'
import { onBeforeMount, onMounted, ref } from 'vue'
import router from '@/router'
import { lastPlayed } from '@/api/routes/songs'
import { allPlaylists } from '@/api/routes/playlists'
import { allArtists } from '@/api/routes/artists'
import PlaylistItem from '@/components/PlaylistItem.vue'
import ArtistItem from '@/components/ArtistItem.vue'
import { useUserStore } from '@/stores/user'
import { useQueueStore } from '@/stores/queue'

const songs = ref([])
const playlists = ref([])
const artists = ref([])
const songContainerRef = ref(null)
const playlistContainerRef = ref(null)
const artistContainerRef = ref(null)
const songPageIndex = ref(0)
const playlistPageIndex = ref(0)
const artistPageIndex = ref(0)
const userStore = useUserStore()
const queueStore = useQueueStore()
let isScrolling = false

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
  const songResponse = await lastPlayed()
  if (songResponse.success) {
    songs.value = songResponse.songs
    const fillerSongCount = 8 - songs.value.length % 8

    for (let i = 0; i < fillerSongCount; i++) {
      songs.value.push({songId: 0, title: "", cover: "", artists: []})
    }
  }

  const playlistResponse = await allPlaylists()
  if (playlistResponse.success) {
    playlists.value = playlistResponse.playlists
    const fillerPlaylistCount = 10 - playlists.value.length % 10

    for (let i = 0; i < fillerPlaylistCount; i++) {
      playlists.value.push({playlistId: 0, name: "", songCount: 0, playlistDuration: 0})
    }
  }
  
  const artistResponse = await allArtists()
  if (artistResponse.success) {
    artists.value = artistResponse.artists
    const fillerArtistCount = 10 - artists.value.length % 10

    for (let i = 0; i < fillerArtistCount; i++) {
      artists.value.push({artistId: 0, name: ""})
    }
  } 
})
</script>
<template>
  <div id="site-layout">
    <section>
      <div>Recently Played</div>
      <div id="song-container" ref="songContainerRef">
        <div v-for="song in songs" :style="{ 'visibility': song.songId == 0 ? 'hidden' : 'visible'}" @click="playSong(song)">
          <img :src="song.cover" alt="">
          <div>
            <div>
              <div>{{ song.title }}</div>
              <div>{{ song.artists.map(artist => artist.artistName).join(", ") || "(None)" }}</div>
            </div>
            <button class="button-dark-hover">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="6 3 20 12 6 21 6 3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="scroll-container" v-if="songs.length > 8" >
        <button class="icon-button" :class="{ 'disabled-button': songPageIndex === 0 }" @click="scroll('songs', 'left')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
          </svg>
        </button>
        <button class="icon-button" :class="{ 'disabled-button': songPageIndex === songs.length / 8 - 1}" @click="scroll('songs', 'right')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
          </svg>
        </button>
      </div>
    </section>
    <section>
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
    <section>
      <div>Artists</div>
      <div id="artist-container" ref="artistContainerRef">
        <div v-for="artist of artists" :style="{ 'visibility': artist.artistId == 0 ? 'hidden' : 'visible'}">
          <ArtistItem :artist="artist"/>
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

      button {
        background-color: var(--accent);
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

      > div {
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
      
      > button {
        height: 50px;
        width: 50px;
        flex-shrink: 0;
        border-radius: 50%;
        background-color: var(--background);
        margin-left: 10px;

        svg {
          height: 30px;
          width: 30px;
          fill: var(--background);
        }
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