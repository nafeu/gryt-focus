import {
  TOGGLE_TIMER,
  START_TIMER,
  STOP_TIMER,
  RESET_TIMER
} from '../constants/actionTypes'

export const toggleTimer = () => {
  return dispatch => {
    dispatch({
      type: TOGGLE_TIMER
    })
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