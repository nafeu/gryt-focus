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
