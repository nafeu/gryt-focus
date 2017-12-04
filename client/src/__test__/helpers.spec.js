import * as helpers from '../helpers'

describe('Helper functions', () => {

  describe('getNextIndex function', () => {
    it('should return 0 for a collection of length 0', () => {
      expect(helpers.getNextIndex(0, 0)).toBe(0)
    })
    it('should rotate through indices for a given length', () => {
      expect(helpers.getNextIndex(0, 3)).toBe(1)
      expect(helpers.getNextIndex(1, 3)).toBe(2)
      expect(helpers.getNextIndex(2, 3)).toBe(0)
    })
  })

  describe('getMsByMins function', () => {
    it('should return milliseconds from minutes', () => {
      expect(helpers.getMsByMins(1)).toBe(60000)
      expect(helpers.getMsByMins(0)).toBe(0)
    })
  })

  describe('getMsBySecs function', () => {
    it('should return milliseconds from seconds', () => {
      expect(helpers.getMsBySecs(1)).toBe(1000)
      expect(helpers.getMsBySecs(0)).toBe(0)
    })
  })

  describe('getDisplayTime function', () => {
    it('should return a formatted display time using a utc timestamp', () => {
      expect(helpers.getDisplayTime(0)).toBe("00:00:00")
      expect(helpers.getDisplayTime(1000)).toBe("00:00:01")
      expect(helpers.getDisplayTime(60000)).toBe("00:01:00")
    })
  })

  describe('getTimeSinceStart function', () => {
    it('should return the ms since the given start time', () => {
      expect(helpers.getTimeSinceStart(762152400).toString().length).toBe(13)
    })
  })

  describe('getElapsedTime function', () => {
    it('should return the elapsedTime given start, end and accumulation', () => {
      const startTime = 762152400
      const endTime = 762153400
      const accumulatedTime = 1000
      expect(helpers.getElapsedTime(startTime, endTime, accumulatedTime)).toEqual(1000)
    })
  })

  describe('calculateFocus function', () => {
    let now = 762152400
    let timeInMs, interruptions, notableInterruption, out

    it('should return correct focus for just starting', () => {
      timeInMs = 0
      interruptions = 0
      notableInterruption = null
      out = helpers.calculateFocus(timeInMs, interruptions, notableInterruption, now)
      expect(out).toEqual("0.00000")
    })

    it('should increment properly for the first minute', () => {
      timeInMs = 0
      out = helpers.calculateFocus(timeInMs, interruptions, notableInterruption, now)
      expect(out).toEqual("0.00000")
      out = helpers.calculateFocus((timeInMs + 1000), interruptions, notableInterruption, now + 1000)
      expect(out).toEqual("0.01667")
      out = helpers.calculateFocus((timeInMs + 2000), interruptions, notableInterruption, now + 2000)
      expect(out).toEqual("0.03333")
      out = helpers.calculateFocus((timeInMs + 5000), interruptions, notableInterruption, now + 5000)
      expect(out).toEqual("0.08333")

    })

    it('should return correct focus for just starting and already interrupted', () => {
      timeInMs = 1000
      interruptions = 1
      notableInterruption = null
      out = helpers.calculateFocus(timeInMs, interruptions, notableInterruption, now)
      expect(out).toEqual("0.01667")
    })

    it('should just ciel to 1.0 for any focus level beyond 0.97', () => {
      timeInMs = 60 * 1000 * 60
      notableInterruption = 763652400 + (3 * 1000 * 60)
      now = 763652400 + timeInMs
      interruptions = 1
      out = helpers.calculateFocus(timeInMs, interruptions, notableInterruption, now)
      expect(out).toEqual("1.00000")
    })

    // it('should ')
    // Just started and are warming up

    // Worked for at least 1 minute

      // get distracted and interruptions is less than minutes worked

      // get distracted and interruptions more than minutes worked

    // One minute after interruption and haven't just started
  })
})