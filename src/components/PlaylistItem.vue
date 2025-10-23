<script setup>
import { formatDuration } from '@/functions'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({playlist: Object})

const playlistRef = ref(null)
const infoFontSize = ref(12)
const nameFontSize = ref(16)

function updateFontSizes() {
  if (!playlistRef.value) return
  const width = playlistRef.value.offsetWidth

  infoFontSize.value = width * 0.08
  nameFontSize.value = width * 0.11
}

onMounted(() => {
  updateFontSizes()
  window.addEventListener('resize', updateFontSizes)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateFontSizes)
})
</script>
<template>
  <div class="playlist-item" ref="playlistRef">
    <img :src="playlist.cover" loading="lazy">
    <div :style="`font-size: ${infoFontSize}px;`">
      <div>{{ playlist.songCount + " Songs"}}</div>
      <div>{{ formatDuration(playlist.duration) }}</div>
    </div>
    <div :style="`font-size: ${nameFontSize}px; margin-top: ${infoFontSize / 2}px; line-height: ${nameFontSize + 5}px; max-height: ${nameFontSize * 2 + 10}px`">
      {{ playlist.name }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.playlist-item {
  width: 100%;
  background-color: var(--objects);
  aspect-ratio: 1/1.5;
  padding: 4%;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    filter: brightness(1.1);
  }

  img {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 5px;
  }

  > div {
    &:not(:last-child) {
      display: flex;
      justify-content: space-between;
    }

    &:last-child {
      display: -webkit-box;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: bold;
      word-break: break-word;
    }
  }
}
</style>