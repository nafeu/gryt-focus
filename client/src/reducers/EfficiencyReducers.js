import { INCREMENT_INTERRUPTIONS, RESET_TIMER } from '../constants/actionTypes'

const initialState = {
  interruptions: 0,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_INTERRUPTIONS:
      return {
        ...state,
        interruptions: state.interruptions + 1
      }

    case RESET_TIMER:
      return {
        ...state,
        interruptions: 0
      }

    default:
      return state
  }
}