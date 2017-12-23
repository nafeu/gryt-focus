const getCurrentFocusIntervals = (state) => state.focusSessions.focusIntervals

export const getIsFocusSessionActive = (state) => {
  const currentFocusIntervals = getCurrentFocusIntervals(state)
  const lastFocusInterval = currentFocusIntervals.slice(-1)[0]
  return lastFocusInterval !== undefined && !lastFocusInterval.hasOwnProperty('endTime')
}
