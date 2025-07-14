import request from "../request.js"

export async function downloadSong(songURL) {
  return request("post", "/songs/download", { data: { songURL }});
}

export async function browseSongs(query) {
  return request("get", "/songs/browse", { params: { query }});
}

export async function songs() {
  return request("get", "/songs");
}

export async function editSong(songId, title, artist, genre, releaseYear, cover) {
  const formData = new FormData()
  formData.append("songId", songId)
  if (title) formData.append("title", title)
  if (artist) formData.append("artist", artist)
  if (genre) formData.append("genre", genre)
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