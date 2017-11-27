import {
  START_TIMER,
  STOP_TIMER,
  RESET_TIMER,
  TOGGLE_MODE,
  SET_SESSION_LENGTH,
  ACTIVATE_ALARM,
  DEACTIVATE_ALARM
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

export const setSessionLength = (sessionLength) => {
  return dispatch => {
    dispatch({
      type: SET_SESSION_LENGTH,
      payload: {sessionLength}
    })
  }
}

export const activateAlarm = () => {
  return dispatch => {
    dispatch({
      type: ACTIVATE_ALARM
    })
  }
}

export const deactivateAlarm = () => {
  return dispatch => {
    dispatch({
      type: DEACTIVATE_ALARM
    })
  }
}