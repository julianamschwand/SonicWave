import request from "../request.js"

export async function downloadSong(songURL, actionRef, downloadRef) {
  return new Promise(resolve => {
    const source = new EventSource(`${import.meta.env.VITE_API_URL}/songs/download-song?songURL=${encodeURIComponent(songURL)}`, { withCredentials: true})

    source.addEventListener("download", event => {
      const data = JSON.parse(event.data)
      actionRef.value = "Downloading song ..."
      downloadRef.value = data
    })

    source.addEventListener("action", event => {
      actionRef.value = JSON.parse(event.data).desc
    })

    source.addEventListener("done", event => {
      source.close()
      actionRef.value = ""
      downloadRef.value = null
      resolve(JSON.parse(event.data))
    })

    source.onerror = (event) => {
      const data = JSON.parse(event?.data)
      source.close()
      console.error("Download error:", data)
      actionRef.value = ""
      downloadRef.value = null
      resolve(data)
    }
  })
}

export async function downloadPlaylist(playlistURL, actionRef, downloadRef) {
  return new Promise(resolve => {
    const source = new EventSource(`${import.meta.env.VITE_API_URL}/songs/download-playlist?playlistURL=${encodeURIComponent(playlistURL)}`, { withCredentials: true})

    source.addEventListener("download", event => {
      const data = JSON.parse(event.data)
      actionRef.value = `Downloading song ${data.currentSong} of ${data.maxSongs} ...`
      downloadRef.value = data
    })

    source.addEventListener("action", event => {
      actionRef.value = JSON.parse(event.data).desc
    })

    source.addEventListener("done", event => {
      source.close()
      actionRef.value = ""
      downloadRef.value = null
      resolve(JSON.parse(event.data))
    })

    source.onerror = (event) => {
      const data = JSON.parse(event?.data)
      source.close()
      console.error("Download error:", data)
      actionRef.value = ""
      downloadRef.value = null
      resolve(data)
    }
  })
}

export async function browseSongs(query, site) {
  return request("get", "/songs/browse", { params: { query, site }});
}

export async function getSongs() {
  return request("get", "/songs");
}

export async function singleSong(songId) {
  return request("get", "/songs/single", { params: { songId }});
}

export async function editSong(songId, title, artistAdd, artistDelete, genre, releaseYear, cover) {
  const formData = new FormData()
  formData.append("songId", songId)
  if (title) formData.append("title", title)
  if (artistAdd) formData.append("artistAdd", JSON.stringify(artistAdd))
  if (artistDelete) formData.append("artistDelete", JSON.stringify(artistDelete))
  if (genre || genre === "") formData.append("genre", genre)
  if (releaseYear) formData.append("releaseYear", releaseYear)
  if (cover) formData.append("cover", cover)
  return request("patch", "/songs/edit", { data: formData });
}

export async function deleteSong(songId) {
  return request("delete", "/songs/delete", { data: { songId }});
}

export async function toggleFavorite(songId) {
  return request("post", "/songs/toggle-favorite", { data: { songId }});
}

export async function resetSong(songId) {
  return request("put", "/songs/reset", { data: { songId }});
}