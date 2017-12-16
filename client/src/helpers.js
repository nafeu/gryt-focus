import moment from 'moment'
import * as d3 from 'd3'

export function getNextIndex (index, length) {
  if (length) return (index === (--length)) ? 0 : ++index
  return 0
}

export function getMsByMins (minutes) {
  return minutes * 60 * 1000
}

export function getMinsByMs (milliseconds) {
  return Math.round(milliseconds / 60 / 1000)
}

export function getMsBySecs (minutes) {
  return minutes * 1000
}

export function getDisplayTime (time) {
  return moment.utc(time).format('HH:mm:ss')
}

export function getTimeSinceStart (startTime) {
  return moment.now() - startTime
}

export function getElapsedTime (start, end, accumulation) {
  if (start && end) {
    return accumulation
  } else if (start) {
    return accumulation + getTimeSinceStart(start)
  }
  return accumulation
}

export function calculateFocus (timeInMs, interruptions, notableInterruption, now) {
  let out
  const oneMinInMs = 60000
  const timeInMins = ((timeInMs * 0.001) / 60)
  const interruptionsOverTime = interruptions / timeInMins
  const focus = Math.max((1 - interruptionsOverTime), 0)
  const lastInterruption = (notableInterruption > 0) ? notableInterruption : now

  // Just started and are warming up
  if ((now - lastInterruption) < oneMinInMs) {
    out = (timeInMs / oneMinInMs)
  }
  // Worked for at least 1 minute
  else if (timeInMs > oneMinInMs) {
    // get distracted and interruptions is less than minutes worked
    if (interruptions < Math.floor(timeInMs / oneMinInMs)) {
      out = focus
    }
    // get distracted and interruptions more than minutes worked
    else {
      out = 0
    }
  } else {
    out = 0
  }

  if (out < 1 && out > 0.97) {
    out = 1
  }

  // One minute after interruption and haven't just started
  return out.toFixed(5)
}

export function updateGraphData (graph, dataPoint) {
  const out = [...graph]
  out.shift()
  out.push({ y: dataPoint.toString() })
  return out
}

export function initGraphData (range) {
  const defaultDataPoint = 0
  return d3.range(range).map((d) => {
    return { y: defaultDataPoint.toFixed(5) }
  })
}
