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