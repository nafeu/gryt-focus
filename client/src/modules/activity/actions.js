import { SAVE_SESSION, RESET_TIMER } from '../../constants/action-types'

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
