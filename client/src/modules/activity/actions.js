import { SAVE_SESSION, RESET_TIMER } from '../../constants/actionTypes'

export const saveSession = (sessionInfo) => {
  return dispatch => {
    dispatch({
      type: RESET_TIMER
    })
    dispatch({
      type: SAVE_SESSION,
      payload: {sessionInfo}
    })
  }
}
