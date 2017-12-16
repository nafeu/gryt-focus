import { SET_TASK, SET_ALERT } from '../../constants/actionTypes'

export const setTask = (name) => {
  return dispatch => {
    dispatch({
      type: SET_TASK,
      payload: {name}
    })
  }
}

export const setAlert = (message) => {
  return dispatch => {
    dispatch({
      type: SET_ALERT,
      payload: {message}
    })
  }
}
