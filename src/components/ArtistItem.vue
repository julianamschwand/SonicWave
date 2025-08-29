<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue' 

const props = defineProps({artist: Object})

const artistRef = ref(null)
const fontSize = ref(16)

function updateFontSizes() {
  if (!artistRef.value) return
  fontSize.value = artistRef.value.offsetWidth * 0.105
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
  <div id="artist-item" ref="artistRef" :style="`gap: ${fontSize}px;`">
    <img :src="artist.image" alt="">
    <div :style="`font-size: ${fontSize}px;`">{{ artist.name }}</div>
  </div>
</template>
<style lang="scss" scoped>
#artist-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  padding: 5%;
  aspect-ratio: 1/1.6;
  cursor: pointer;

  &:hover {
    background-color: var(--objects);
  }

  img {
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }

  > div {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    word-break: break-word;
    text-align: center;
  }
}
</style>