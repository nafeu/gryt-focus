import {
  START_TIMER,
  STOP_TIMER,
  RESET_TIMER,
  TOGGLE_MODE
} from '../constants/actionTypes'

export const toggleTimer = (isActive) => {
  return dispatch => {
    if (isActive) {
      dispatch({
        type: STOP_TIMER
      })
    } else {
      dispatch({
        type: START_TIMER
      })
    }
  }
}

export const startTimer = () => {
  return dispatch => {
    dispatch({
      type: START_TIMER
    })
  }
}

export const stopTimer = () => {
  return dispatch => {
    dispatch({
      type: STOP_TIMER
    })
  }
}

export const resetTimer = () => {
  return dispatch => {
    dispatch({
      type: RESET_TIMER
    })
  }
}

export const toggleMode = () => {
  return dispatch => {
    dispatch({
      type: TOGGLE_MODE
    })
  }
}