import { SET_TASK, SET_ALERT } from '../../constants/actionTypes'

const initialState = {
  name: '',
  alert: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TASK:
      return {
        ...state,
        name: action.payload.name
      }

    case SET_ALERT:
      return {
        ...state,
        alert: action.payload.message
      }

    default:
      return state
  }
}
