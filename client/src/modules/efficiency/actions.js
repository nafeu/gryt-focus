import { INCREMENT_INTERRUPTIONS } from '../../constants/actionTypes'

export const incrementInterruptions = () => {
  return dispatch => {
    dispatch({
      type: INCREMENT_INTERRUPTIONS
    })
  }
}
