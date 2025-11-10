<script setup>
import { computed } from 'vue'
import { useArtistStore } from '@/stores/artists.js'
import { usePlaylistStore } from '@/stores/playlists.js'
import { useSongStore } from '@/stores/songs.js'
import { useQueueStore } from '@/stores/queue.js'
import PlayButton from './PlayButton.vue'

const props = defineProps({query: String})
const emit = defineEmits(["selected"])

const songStore = useSongStore()
const playlistStore = usePlaylistStore()
const artistStore = useArtistStore()
const queueStore = useQueueStore()

const songs = computed(() => {
  return songStore.songs.filter(song => {
    const songData = `${song.title} ${song.artists.map(artist => artist = artist.name).join(" ")} ${song.genre}`.toLowerCase()
    const queryIncluded = props.query.split(" ").every(word => songData.includes(word.toLowerCase()))
    return queryIncluded && song.isVisible
  })
})

const playlists = computed(() => {
  return playlistStore.playlists.filter(playlist => {
    const playlistData = `${playlist.name} ${playlist.description}`.toLowerCase()
    const queryIncluded = props.query.split(" ").every(word => playlistData.includes(word.toLowerCase()))
    return queryIncluded
  })
})

const artists = computed(() => {
  return artistStore.artists.filter(artist => {
    const artistData = `${artist.name} ${artist.description}`.toLowerCase()
    const queryIncluded = props.query.split(" ").every(word => artistData.includes(word.toLowerCase()))
    return queryIncluded
  })
})

</script>
<template>
  <div id="dropdown-container">
    <div class="search-results-container" v-if="songs.length + playlists.length + artists.length">
      <div v-if="songs.length">
        <div class="dropdown-title">Songs</div>
        <div class="dropdown-content">
          <div class="song-list" v-for="song in songs" @click="queueStore.initQueue([song]), emit('selected')">
            <div>
              <img :src="song.cover" loading="lazy">
              <div>{{ song.title }}</div>  
            </div>
            <PlayButton :size="35" :songId="song.songId"/>
          </div>
        </div>
      </div>
      <div v-if="playlists.length">
        <div class="dropdown-title">Playlists</div>
        <div class="dropdown-content">
          <div v-for="playlist in playlists" @click="emit('selected', `/playlists/${playlist.playlistId}`)">
            <div>
              <img :src="playlist.cover" loading="lazy">
              <div>{{ playlist.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="artists.length">
        <div class="dropdown-title">Artists</div>
        <div class="dropdown-content">
          <div class="artist-list" v-for="artist in artists" @click="emit('selected', `/artist/${artist.artistId}`)">
            <div>
              <img :src="artist.image" loading="lazy">
              <div>{{ artist.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="no-search-results-container" v-else>
      No search results
    </div>
  </div>
</template>
<style lang="scss" scoped>
#dropdown-container {
  width: 450px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  z-index: 1;

  .search-results-container {
    display: flex;
    flex-direction: column;
    gap: 5px;

    > div {
      display: flex;
      gap: 5px;
      flex-direction: column;

      > div {
        border-radius: 5px;
      }

      .dropdown-title {
        background-color: var(--objects);
        color: white;
        font-weight: bold;
        padding: 3px;
        padding-left: 5px;
        font-size: 14px;
      }

      .dropdown-content {
        background-color: var(--background);
        border: 2px solid var(--objects);
        padding: 5px;
        font-weight: 650;
        font-size: 13px;

        > div {
          padding: 5px;
          border-radius: 5px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;

          > div:first-child {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-grow: 1;
            min-width: 0;

            > div {
              flex-grow: 1;
              min-width: 0;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
          
          &:hover {
            background-color: var(--objects);
          }

          img {
            height: 40px;
            aspect-ratio: 1/1;
            border-radius: 5px;
          } 
        }

        .song-list {
          justify-content: space-between;

          > div:last-child {
            display: none;
          }

          &:hover > div:last-child {
            display: flex;
          }
        }

        .artist-list img {
          border-radius: 50%;
        }
      }
    }
  }

  .no-search-results-container {
    border: 2px solid var(--objects);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 14px;
    background-color: var(--background);
  }
}
</style>