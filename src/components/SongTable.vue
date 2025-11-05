<script setup>
import { reactive } from 'vue'
import { formatDuration } from '@/functions.js'
import { useSongStore } from '@/stores/songs.js'
import { useQueueStore } from '@/stores/queue.js'
import { usePlaylistStore } from '@/stores/playlists'
import router from '@/router'
import draggable from 'vuedraggable'
import PlayButton from './PlayButton.vue'

const songStore = useSongStore()
const queueStore = useQueueStore()
const playlistStore = usePlaylistStore()
const downloadAction = reactive({})
const downloadStats = reactive({})

const props = defineProps({
  songs: Array,
  playlistId: Number,
  artistId: Number,
  coverSize: Number,
  enableSongPlay: Boolean,
  enableSelect: Boolean,
  enableDrag: Boolean,
  checkedSongs: Array,
  enabledComponents: Array
})

const emit = defineEmits(["playSong", "toggleSong"])

const handlePlaySong = (songId) => {
  if (!props.enableSongPlay) return
  emit("playSong", songId)
}

const handleDownload = async (url, index) => {
  props.songs[index]["status"] = "downloading"

  const response = await songStore.downloadSong(url, downloadAction, downloadStats, String(index))

  if (response.success) {
    props.songs[index]["status"] = "success"
  } else {
    props.songs[index]["status"] = "error"
  }
}

const handleToggleSong = (songId) => {
  if (!props.enableSelect) return

  emit("toggleSong", songId)
}

const handleEditSong = (songId) => {
  if (props.playlistId) router.push(`/playlists/${props.playlistId}/edit/song/${songId}`)
  else if (props.artistId) router.push(`/artist/${props.artistId}/edit/song/${songId}`)
  else router.push(`/library/edit/song/${songId}`)
}

const onDragEnd = () => {
  const newOrder = props.songs.map(song => song.songId)
  playlistStore.updateOrder(props.playlistId, newOrder)
}
</script>
<template>
  <div id="song-table">
    <draggable
      :list="props.songs"
      item-key="songId"
      :disabled="!enableDrag"
      handle=".drag-handle"
      :animation="150"
      @end="onDragEnd"
      tag="div"
    > 
      <template #item="{ element: song, index }">
        <div class="song-item" :class="{ 'enabled-select': enableSelect, 'checked': checkedSongs?.includes(song.songId) }" @click="handleToggleSong(song.songId)">
          <div :class="{ 'enabled-song-play': enableSongPlay }" @click="handlePlaySong(song.songId)">
            <div>
              <div
                v-if="enableDrag"
                class="drag-handle"
                title="Drag to reorder"
                style="cursor: grab; user-select: none;"
              >
                ⠿
              </div>
              <button class="checkbox" v-if="enableSelect">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                </svg>
              </button>
              <img :src="song.cover" :style="`width: ${coverSize ? coverSize : 60}px;`" loading="lazy">
              <div>{{ song.title }}</div>
              <div class="music-playing-animation" v-if="queueStore.songPlaying(song.songId) && enableSongPlay">
                <span></span><span></span><span></span>
              </div>
            </div>
            <PlayButton :size="50" :songId="song.songId"/>
          </div>
          <div>
            <div v-if="enabledComponents.includes('artists')">{{ song.artists.map(artist => artist.name).join(", ") || "(None)" }}</div>
            <div v-if="enabledComponents.includes('genre')">{{ song.genre || "(None)" }}</div>
            <div v-if="enabledComponents.includes('releaseYear')">{{ song.releaseYear }}</div>
            <div v-if="enabledComponents.includes('duration')">{{ formatDuration(song.duration) }}</div>
            <div class="icon-container" v-if="enabledComponents.some(component => !['artists','genre','releaseYear','duration'].includes(component))">
              <div v-if="enabledComponents.includes('favorite')" @click="songStore.toggleFavorite(song.songId)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" v-if="!song.isFavorite">
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff00ae" v-if="song.isFavorite">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div v-if="enabledComponents.includes('edit')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" @click="handleEditSong(song.songId)">
                  <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                </svg>
              </div>
              <div v-if="enabledComponents.includes('delete')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" @click="songStore.deleteSong(song.songId)">
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
              </div>
              <div v-if="enabledComponents.includes('remove')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" @click="playlistStore.deleteFromPlaylist(playlistId, song.songId)">
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
              </div>
              <div class="download-icon" v-if="enabledComponents.includes('download') && !song.status">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" @click="handleDownload(song.url, index)">
                  <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                </svg>
              </div>
              <div class="download-icon" v-if="enabledComponents.includes('download') && song.status === 'downloading' && !downloadStats[String(index)]">
                <div class="loader-download"></div>
              </div>
              <div class="download-icon" v-if="enabledComponents.includes('download') && song.status === 'downloading' && downloadStats[String(index)]">
                <div class="progress-ring" :style="`background: conic-gradient(white ${downloadStats[String(index)].progress * 3.6}deg, var(--background) 0deg);`"></div>
              </div>
              <div class="download-icon" v-if="enabledComponents.includes('download') && song.status === 'success'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" class="unclickable">
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                </svg>
              </div>
              <div class="download-icon" v-if="enabledComponents.includes('download') && song.status === 'error'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF" class="unclickable">
                  <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>
<style lang="scss" scoped>
#song-table {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 16px;

  * {
    box-sizing: border-box;
  }

  .enabled-select:hover {
    background-color: var(--objects);
    cursor: pointer;
  }

  .checked {
    background-color: var(--objects);

    > div > div > button {
      background-color: var(--accent) !important;
    }
  }

  .song-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding-right: 10px;

    > div {
      display: flex;
    }

    div {
      align-items: center;
    }

    > div:first-child {
      gap: 20px;
      font-weight: bold;
      width: 45%;
      max-width: 45%;
      min-width: 45%;
      justify-content: space-between;
      padding: 10px;
      border-radius: 5px;

      > div:first-child {
        display: flex;
        gap: 20px;
        flex-grow: 1;
        min-width: 0;

        .drag-handle {
          cursor: grab;
          user-select: none;
          font-size: 18px;
          padding-right: 4px;
        }

        .drag-handle:active {
          cursor: grabbing;
        }

        .checkbox {
          height: 20px;
          width: 20px;
          background-color: var(--background);
          border: 2px solid var(--accent);
          padding: 0px;

          svg {
            fill: var(--background);
            width: 100%;
            height: 100%;
          }
        }
        
        img {
          width: 60px;
          aspect-ratio: 1/1;
          border-radius: 5px;
          flex-shrink: 0;
        }

        div:last-child {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          min-width: 0;
        }
      }
      
      > div:last-child {
        display: none;
      }
    }

    > div:last-child {
      width: 55%;
      max-width: 55%;
      min-width: 55%;
      justify-content: space-between;

      > div {
        flex: 1;
        text-align: center;
      }

      > .icon-container {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        
        > div {
          height: 30px;
        }
      }
    }

    .enabled-song-play:hover {
      background-color: var(--objects);
      cursor: pointer;

      > div:last-child {
        display: flex;
      }
    }
  }

  svg {
    cursor: pointer;
    width: 30px;
    height: 30px;

    &:hover {
      filter: brightness(0.8);
    }
  }

  .download-icon {
    svg {
      height: 35px;
      width: 35px;
    }

    > div {
      height: 30px;
      width: 30px;
      background-color: white;
      margin-right: 2px;
    }

    .progress-ring {
      border-radius: 50%;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        inset: 3px;
        background-color: var(--background);
        border-radius: 50%;
      }
    }
  }
}
</style>