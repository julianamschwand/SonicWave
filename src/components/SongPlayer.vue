<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useQueueStore } from '@/stores/queue.js'
import { NSlider } from 'naive-ui'
import { formatDuration } from '@/functions.js'
import PlayButton from './PlayButton.vue'
import { useSongStore } from '@/stores/songs'
import router from '@/router'

const queueStore = useQueueStore()
const songStore = useSongStore()
const audioRef = ref(null)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(100)

const song = computed(() => {
  return songStore.songs.find(song => song.songId == queueStore.queue[queueStore.queueIndex])
})

const songUrl = computed(() => {
  return `${import.meta.env.VITE_API_URL}/songs/play?songId=${song.value.songId}`
})


const playPauseSong = () => {
  if (queueStore.songIsPlaying) audioRef.value.pause()
  else audioRef.value.play()
} 

const updateVolume = (value) => {
  audioRef.value.volume = value / 100
  localStorage.setItem("volume", value)
}

onMounted(() => {
  const audio = audioRef.value

  volume.value = localStorage.getItem("volume") !== "null" ? Number(localStorage.getItem("volume")) : 100
  audio.volume = volume.value / 100

  audio.addEventListener('loadedmetadata', () => duration.value = audio.duration)
  audio.addEventListener('timeupdate', () => currentTime.value = audio.currentTime)
  audio.addEventListener('play', () => queueStore.songIsPlaying = true)
  audio.addEventListener('pause', () => queueStore.songIsPlaying = false)
  audio.addEventListener('ended', () => queueStore.songIsPlaying = false)

  navigator.mediaSession.setActionHandler('play', () => audioRef.value.play())
  navigator.mediaSession.setActionHandler('pause', () => audioRef.value.pause())

  watch(() => song.value, () => {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.value.title,
      artist: song.value.artists.map(artist => artist.name).join(", ") || "Unknown Artist",
      artwork: [{ src: song.value.cover, sizes: "1000x1000", type: "image/avif" }]
    })

    if (queueStore.queueIndex === 0) navigator.mediaSession.setActionHandler('previoustrack', null)
    else navigator.mediaSession.setActionHandler('previoustrack', () => queueStore.changeSong('backward'))
    if (queueStore.queueIndex === queueStore.queue.length - 1) navigator.mediaSession.setActionHandler('nexttrack', null)
    else navigator.mediaSession.setActionHandler('nexttrack', () => queueStore.changeSong('forward'))
  }, { immediate: true })
})
</script>
<template>
  <div id="player-container">
    <audio :src="songUrl" ref="audioRef" autoplay @ended="queueStore.changeSong('forward')"></audio>
    <div id="cover-container">
      <img :src="song.cover">
    </div>
    <div id="close-box" class="button-light-hover" @click="queueStore.clearQueue()">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
      </svg>
    </div>
    <div>
      <n-slider id="timeline-slider" :tooltip="false" :max="duration" v-model:value="currentTime" @update:value="value => audioRef.currentTime = value"/>
      <div id="content-container">
        <div>
          <div id="title">{{ song.title }}</div>
          <div id="artist">
            <div v-for="(artist, index) in song.artists" @click="router.push(`/artist/${artist.artistId}`)">{{ artist.name + (index < song.artists.length - 1 ? "," : "") }}</div>
            <div id="unknown-artist" v-if="!song.artists.length">Unknown Artist</div>
          </div>
        </div>
        <div id="control-buttons">
          <button @click="queueStore.changeSong('backward')" :class="{ 'disabled-button': queueStore.queueIndex === 0 }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="19 20 9 12 19 4 19 20"/>
              <line x1="5" x2="5" y1="19" y2="5"/>
            </svg>
          </button>
          <PlayButton :size="60" :songId="song.songId" @click="playPauseSong"/>
          <button @click="queueStore.changeSong('forward')" :class="{ 'disabled-button': queueStore.queueIndex === queueStore.queue.length - 1 }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/>
            </svg>
          </button>
        </div>
        <div id="right-container">
          <div id="volume-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-if="volume > 50">
              <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
              <path d="M16 9a5 5 0 0 1 0 6"/>
              <path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-else-if="volume > 0 && volume <= 50">
              <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
              <path d="M16 9a5 5 0 0 1 0 6"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-else>
              <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
            </svg>
            <n-slider id="volume-slider" :tooltip="false" v-model:value="volume" @update:value="value => updateVolume(value)"/>
            <div>{{ volume + "%" }}</div>
          </div>
          <div>{{`${formatDuration(Math.round(currentTime))} / ${formatDuration(Math.round(duration))}` }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#player-container {
  width: calc(100% - 10px);
  height: 100px;
  background-color: var(--objects);
  margin: 5px;
  border-radius: 5px;
  border-top-right-radius: 0px;
  display: flex;
  align-items: start;
  position: relative;

  > div {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
}

#cover-container {
  background-color: var(--accent);
  border-radius: 5px;
  border-top-right-radius: 0px;
  max-width: 100px;
}

img {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

#content-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;

  > div {
    flex: 1;
    min-width: 0px;
  }
}

#title {
  font-size: 17px;
  font-weight: bold;
}

#artist {
  font-size: 13px;
  display: flex;
  gap: 3px;

  > div:not(#unknown-artist):hover {
    text-decoration: underline;
    cursor: pointer;
  }
}

#title, #artist {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

#timeline-slider {
  width: 100%;
  margin-top: -7px;

  :deep(.n-slider-rail) {
    height: 7px;
    border-radius: 0px;
    border-top-right-radius: 5px;
    background-color: var(--objects);
  }

  :deep(.n-slider-rail__fill) {
    border-radius: 0px;
    background-color: var(--accent);
  }
}

#control-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  > button {
    background-color: var(--accent);
    border-radius: 50%;
    height: 45px;
    width: 45px;

    &:hover {
      filter: brightness(0.9);
    }
  }

  svg {
    fill: var(--background);
    stroke: var(--background);
    width: 25px;
    height: 25px;
  } 
}

#right-container {
  display: flex;
  justify-content: right;
  height: 100%;
  align-items: center;
  gap: 20px;

  svg {
    height: 30px;
    width: 30px;
    fill: none;
    stroke: var(--accent);
  }

  > div:last-child {
    width: 100px;
    height: 100%;
    text-align: right;
    font-size: 14px;
  }
}

#volume-container {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 30px;

  > div:last-child {
    color: var(--accent);
    font-weight: bold;
    font-size: 16px;
    width: 43px;
    text-align: right;
  }
}

#volume-slider {
  width: 120px;

  :deep(.n-slider-rail) {
    background-color: var(--background);
  }

  :deep(.n-slider-rail__fill) {
    background-color: var(--accent);
  }
}

#close-box {
  max-width: 30px;
  max-height: 30px;
  background-color: var(--objects);
  position: absolute;
  top: -30px;
  right: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  cursor: pointer;

  svg {
    fill: white;
    width: 20px;
    height: 20px;
  } 
}
</style>