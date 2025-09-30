<script setup>
import { useQueueStore } from '@/stores/queue.js'

const props = defineProps({size: Number, songId: Number})

const queueStore = useQueueStore()
</script>
<template>
  <div :style="`width: ${props.size}px; height: ${props.size}px;`"> 
    <button class="button-dark-hover">
      <svg :width="props.size * 0.6" :height="props.size * 0.6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" v-if="!queueStore.songPlaying(songId)">
        <polygon points="6 3 20 12 6 21 6 3"/>
      </svg>
      <svg :width="props.size * 0.6" :height="props.size * 0.6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" v-if="queueStore.songPlaying(songId)">
        <rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>
      </svg>
    </button>
  </div> 
</template>
<style lang="scss" scoped>
div {
  object-fit: contain;
  flex-shrink: 0;
}

button {
  background-color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-grow: 0;
  width: 100%;
  aspect-ratio: 1/1;

  svg {
    fill: var(--background);
  }
}
</style>