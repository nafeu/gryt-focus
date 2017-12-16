import { INCREMENT_INTERRUPTIONS } from '../../constants/action-types'

export const incrementInterruptions = () => {
  return dispatch => {
    dispatch({
      type: INCREMENT_INTERRUPTIONS
    })
  }
}
