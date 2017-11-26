import moment from 'moment'

export function getNextIndex(index, length) {
  if (length) return (index === (--length)) ? 0 : ++index
  return 0
}

export function getMsByMins(minutes) {
  return minutes * 60 * 1000
}

export function getMsBySecs(minutes) {
  return minutes * 1000
}

export function getDisplayTime(time) {
  return moment.utc(time).format("HH:mm:ss")
}

export function getTimeSinceStart(startTime) {
  return moment.now() - startTime
}