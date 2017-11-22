import { SET_TASK } from '../constants/actionTypes'

const initialState = {
  name: "",
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TASK:
      return {
        ...state,
        name: action.payload.name
      }

    default:
      return state
  }
}