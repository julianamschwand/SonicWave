import request from "../request.js"

export async function allArtists() {
  return request("get", "/artists")
}

export async function singleArtist(artistId) {
  return request("get", "/artists/single", { params: { artistId }})
}

export async function editArtist(artistId, name, description, image) {
  const formData = new FormData()
  formData.append("artistId", artistId)
  if (name) formData.append("name", name)
  if (description || description === "") formData.append("description", description)
  if (image) formData.append("image", image)
  return request("patch", "/artists/edit", { data: formData });
}