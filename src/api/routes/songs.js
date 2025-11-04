import request from "../request.js"

async function download(mode, downloadURL, actionObj, downloadObj, objKey) {
  return new Promise(resolve => {
    const source = new EventSource(`${import.meta.env.VITE_API_URL}/songs/download-${mode}?songURL=${encodeURIComponent(downloadURL)}`, { withCredentials: true})

    source.addEventListener("download", event => {
      const data = JSON.parse(event.data)
      actionObj[objKey] = mode === "song" ? 
        "Downloading song ..." : 
        `Downloading song ${data.currentSong} of ${data.maxSongs} ...`
      downloadObj[objKey] = data
    })

    source.addEventListener("action", event => {
      actionObj[objKey] = JSON.parse(event.data).desc
    })

    source.addEventListener("done", event => {
      source.close()
      actionObj[objKey] = ""
      downloadObj[objKey] = null
      resolve(JSON.parse(event.data))
    })

    source.onerror = (event) => {
      const data = JSON.parse(event?.data)
      source.close()
      console.error("Download error:", data)
      actionObj[objKey] = ""
      downloadObj[objKey] = null
      resolve(data)
    }
  })
}

export const downloadSong = (songURL, actionObj, downloadObj, objKey) => download("song", songURL, actionObj, downloadObj, objKey)
export const downloadPlaylist = (playlistURL, actionObj, downloadObj, objKey) => download("playlist", playlistURL, actionObj, downloadObj, objKey)

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