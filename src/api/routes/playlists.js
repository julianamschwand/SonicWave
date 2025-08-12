import request from "../request.js"

export async function createPlaylist(name, description, cover) {
  const formData = new FormData()
  formData.append("name", name)
  if (description) formData.append("description", description)
  if (cover) formData.append("cover", cover)
  return request("post", "/playlists/create", { data: formData });
}

export async function editPlaylist(playlistId, name, description, cover) {
  const formData = new FormData()
  formData.append("playlistId", playlistId)
  if (name) formData.append("name", name)
  if (description || description === "") formData.append("description", description)
  if (cover) formData.append("cover", cover)
  return request("patch", "/playlists/edit", { data: formData });
}

export async function deletePlaylist(playlistId) {
  return request("delete", "/playlists/delete", { data: { playlistId }});
}

export async function addToPlaylist(playlistId, songIds) {
  return request("post", "/playlists/add-song", { data: { playlistId, songIds }});
}

export async function deleteFromPlaylist(playlistId, songId) {
  return request("delete", "/playlists/delete-song", { data: { playlistId, songId }});
}

export async function allPlaylists() {
  return request("get", "/playlists");
}

export async function singlePlaylist(playlistId) {
  return request("get", "/playlists/single", { params: { playlistId }});
}