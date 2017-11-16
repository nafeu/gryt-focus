import { TOGGLE_TIMER } from '../constants/actionTypes'

export const toggleTimer = () => {
  return dispatch => {
    dispatch({
      type: TOGGLE_TIMER
    })
  }
}