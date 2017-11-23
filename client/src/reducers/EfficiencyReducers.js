import { INCREMENT_INTERRUPTIONS } from '../constants/actionTypes'

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

    default:
      return state
  }
}