import { SET_TASK } from '../constants/actionTypes'

export const setTask = (name) => {
  return dispatch => {
    dispatch({
      type: SET_TASK,
      payload: {name}
    })
  }
}