import request from "../request.js"

export async function downloadSong(songURL) {
  return request("post", "/songs/download", { data: { songURL }});
}

export async function browseSongs(query) {
  return request("get", "/songs/browse", { params: { query }});
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

export async function recentlyPlayed() {
  return request("get", "/songs/recently-played")
}