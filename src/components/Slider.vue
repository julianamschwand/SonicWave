<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  style: { type: Object, default: {} }
})

const emit = defineEmits(['update:modelValue'])
const sliderRef = ref(null)
let isDragging = false

const percentage = computed(() => {
  if (props.max === props.min) return 0
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100
})

const getClientX = (event) => {
  return event.touches ? event.touches[0].clientX : event.clientX
}

const updateValueFromEvent = (event) => {
  if (!sliderRef.value) return
  const rect = sliderRef.value.getBoundingClientRect()
  const x = getClientX(event) - rect.left
  const ratio = Math.min(Math.max(x / rect.width, 0), 1)
  const rawValue = props.min + ratio * (props.max - props.min)
  const stepped = Math.round(rawValue / props.step) * props.step
  emit('update:modelValue', Math.min(props.max, Math.max(props.min, stepped)))
}

const startDrag = (event) => {
  isDragging = true
  updateValueFromEvent(event)

  window.addEventListener('mousemove', handleMove)
  window.addEventListener('mouseup', stopDrag)

  window.addEventListener('touchmove', handleMove, { passive: false })
  window.addEventListener('touchend', stopDrag)
}

const handleMove = (event) => {
  if (!isDragging) return
  event.preventDefault?.()
  updateValueFromEvent(event)
}

const stopDrag = () => {
  isDragging = false
  window.removeEventListener('mousemove', handleMove)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', handleMove)
  window.removeEventListener('touchend', stopDrag)
}

onBeforeUnmount(() => {
  stopDrag()
})
</script>
<template>
  <div
    ref="sliderRef"
    class="slider"
    :style="{ 
      width: style.width ? style.width : '100%',
      height: style.height ? style.height : '5px',
      borderRadius: style.borderRadius ? style.borderRadius : '5px',
      backgroundColor: style.trackColor ? style.trackColor : 'var(--background)'
    }"
    @mousedown="startDrag"
    @touchstart.prevent="startDrag"
  >
    <div 
      class="slider-fill" 
      :style="{ 
        width: percentage + '%',
        borderRadius: style.borderRadius ? style.borderRadius : '5px',
        backgroundColor: style.fillColor ? style.fillColor : 'var(--accent)'
      }"
    ></div>
    <div 
      class="slider-thumb" 
      :style="{ 
        left: percentage + '%',
        width: style.thumbSize ? style.thumbSize : '14px',
        backgroundColor: style.thumbColor ? style.thumbColor : 'white'
      }"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
.slider {
  display: flex;
  position: relative;
  height: 5px;
  width: 100%;
  cursor: pointer;
  user-select: none;
  touch-action: none;
  background-color: var(--accent);
}

.slider-fill {
  height: 100%;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  aspect-ratio: 1/1;
  border-radius: 50%;
  border: 2px solid var(--accent);
  transition: transform 0.1s;
}

.slider:hover .slider-thumb {
  background: var(--accent);
}

.slider:active .slider-thumb {
  transform: translate(-50%, -50%) scale(1.1);
}
</style>