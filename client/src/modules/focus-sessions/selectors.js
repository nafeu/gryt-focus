import { createSelector } from 'reselect'

const getCurrentFocusIntervals = (state) => state.focusIntervals

export const getIsFocusSessionActive = createSelector(
  getCurrentFocusIntervals,
  (currentFocusIntervals) => {
    const lastFocusInterval = currentFocusIntervals.slice(-1)[0]
    return lastFocusInterval !== undefined && !lastFocusInterval.hasOwnProperty('endTime')
  }
)
