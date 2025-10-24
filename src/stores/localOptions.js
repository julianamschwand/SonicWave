import { defineStore } from "pinia"
import { parseNull } from "@/functions.js"

export const useLocalOptionsStore = defineStore("localOptions", {
  state: () => ({
    browseOption: "",
    downloadMode: ""
  }),
  actions: {
    getLocalOptions() {
      this.browseOption = parseNull(localStorage.getItem("browseOption")) || "soundcloud"
      this.downloadMode = parseNull(localStorage.getItem("downloadMode")) || "song"
    },
    setBrowseOption(option) {
      this.browseOption = option
      localStorage.setItem("browseOption", option)
    },
    setDownloadMode(mode) {
      this.downloadMode = mode
      localStorage.setItem("downloadMode", mode)
    },
    reset() {
      this.browseOption = ""
      this.downloadMode = ""
    }
  }
})