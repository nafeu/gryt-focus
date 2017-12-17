import moment from 'moment'
import { createSelector } from 'reselect'

const getCurrentFocusIntervals = (state) => state.focusSessions.focusIntervals

export const getIsFocusSessionActive = createSelector(
  getCurrentFocusIntervals,
  (currentFocusIntervals) => {
    const lastFocusInterval = currentFocusIntervals.slice(-1)[0]
    return lastFocusInterval !== undefined && !lastFocusInterval.hasOwnProperty('endTime')
  }
)

export const getFocusSessionElapsedDuration = createSelector(
  getCurrentFocusIntervals,
  (currentFocusIntervals) => {
    if (currentFocusIntervals.length === 0) return 0
    const firstFocusInterval = currentFocusIntervals[0]
    const now = moment.now()
    return now - firstFocusInterval.startTime
  }
)
