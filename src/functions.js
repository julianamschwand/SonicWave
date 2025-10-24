import { useQueueStore } from './stores/queue.js'
import { useUserStore } from './stores/user.js'
import { useArtistStore } from './stores/artists.js'
import { useLocalOptionsStore } from './stores/localOptions.js'
import { useOtherUsersStore } from './stores/otherUsers.js'
import { usePlaylistStore } from './stores/playlists.js'
import { useSongStore } from './stores/songs.js'

export function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const hoursPart = hrs > 0 ? hrs + ":" : ""
  const minutesPart = (hrs > 0 && mins < 10) ? "0" + mins : mins
  const secondsPart = secs < 10 ? "0" + secs : secs

  return hoursPart + minutesPart + ":" + secondsPart
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array
}

export function parseNull(string) {
  return string === "null" ? null : string
}

export async function loadAllData() {
  const userStore = useUserStore()
  const otherUsersStore = useOtherUsersStore()

  useLocalOptionsStore().getLocalOptions()
  await userStore.fetchUserData()
  await useSongStore().getSongs()
  await useQueueStore().loadQueue()
  await usePlaylistStore().getPlaylists()
  await useArtistStore().getArtists()

  if (userStore.userRole === "admin" || userStore.userRole === "owner") {
    const isOwner = userStore.userRole === "owner"

    const apiRequests = [otherUsersStore.getRegisterRequests(), isOwner ? otherUsersStore.getOtherUsers() : Promise.resolve()]
    await Promise.all(apiRequests)
  }
}