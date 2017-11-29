import moment from 'moment'

export function getNextIndex(index, length) {
  if (length) return (index === (--length)) ? 0 : ++index
  return 0
}

export function getMsByMins(minutes) {
  return minutes * 60 * 1000
}

export function getMinsByMs(milliseconds) {
  return Math.round(milliseconds / 60 / 1000)
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

export function getElapsedTime(start, end, accumulation) {
  if (start && end) {
    return accumulation
  } else if (start) {
    return accumulation + getTimeSinceStart(start)
  }
  return accumulation
}

export function calculateFocus(timeInMs, interruptions) {
  const oneMinInMs = 60000
  const timeInSecs = ((timeInMs * 0.001) / 60)
  const interruptionsOverTime = (interruptions / timeInSecs)
  const focus = Math.max(Math.round((1 - interruptionsOverTime) * 100), 0)
  if (timeInMs > oneMinInMs && interruptions < Math.floor(timeInMs / oneMinInMs)) {
    return focus + "%"
  }
  return "..."
}
