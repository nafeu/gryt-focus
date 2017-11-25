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

  describe('getDisplayTime function', () => {
    it('should return a formatted display time using a utc timestamp', () => {
      expect(helpers.getDisplayTime(0)).toBe("00:00:00")
      expect(helpers.getDisplayTime(1000)).toBe("00:00:01")
      expect(helpers.getDisplayTime(60000)).toBe("00:01:00")
    })
  })

  describe('getTimeSinceStarted function', () => {
    it('should return the ms since the given start time', () => {
      expect(helpers.getTimeSinceStart(762152400).toString().length).toBe(13)
    })
  })

})