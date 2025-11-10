import { defineStore } from "pinia"
import { ref } from "vue"

export const useDeviceStore = defineStore("device", () => {
  const isMobile = ref(false)

  const update = () => {
    const aspectRatio = window.innerWidth / window.innerHeight
    const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0

    isMobile.value = aspectRatio < 4/3 && touchDevice
  }

  update()
  window.addEventListener("resize", update)
  window.addEventListener("orientationchange", update)

  return { isMobile }
})