import * as selectors from './selectors'

describe('getIsFocusSessionActive', () => {
  it('is false if there aren\'t any focus intervals in the current focus session', () => {
    const previousState = {
      focusSessions: {
        focusIntervals: []
      }
    }

    const isFocusSessionActive = selectors.getIsFocusSessionActive(previousState)

    expect(isFocusSessionActive).toEqual(false)
  })

  it('is true if there are active focus intervals in the current focus session', () => {
    const previousState = {
      focusSessions: {
        focusIntervals: [{ startTime: 999 }]
      }
    }

    const isFocusSessionActive = selectors.getIsFocusSessionActive(previousState)

    expect(isFocusSessionActive).toEqual(true)
  })

  it('is false if the last focus interval is closed', () => {
    const previousState = {
      focusSessions: {
        focusIntervals: [{ startTime: 998, endTime: 999 }]
      }
    }

    const isFocusSessionActive = selectors.getIsFocusSessionActive(previousState)

    expect(isFocusSessionActive).toEqual(false)
  })
})

describe('getFocusSessionElapsedDuration', () => {
  const now = 999

  it('calculates the duration to be 0 if no focus intervals have been created yet', () => {
    Date.now = jest.fn(() => now)
    const previousState = {
      focusSessions: {
        focusIntervals: []
      }
    }

    const focusSessionElapsedDuration = selectors.getFocusSessionElapsedDuration(previousState)

    expect(focusSessionElapsedDuration).toEqual(0)
  })

  it('calculates the duration from the first focus interval start time until now', () => {
    Date.now = jest.fn(() => now)
    const previousState = {
      focusSessions: {
        focusIntervals: [{ startTime: now - 7 }]
      }
    }

    const focusSessionElapsedDuration = selectors.getFocusSessionElapsedDuration(previousState)

    expect(focusSessionElapsedDuration).toEqual(7)
  })
})
