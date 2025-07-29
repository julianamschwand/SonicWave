import request from '../request.js'

export async function getQueue() {
  return request("get", "/queue")
}

export async function setQueue(queue) {
  return request("post", "/queue/set", { data: { queue }})
}

export async function changeSong(action) {
  return request("patch", "/queue/change-song", { data: { action }})
}

export async function clearQueue() {
  return request("delete", "/queue/clear")
}