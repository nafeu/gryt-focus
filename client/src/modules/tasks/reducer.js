import { SET_TASK, SET_ALERT } from './action-types'

const BLANK_STATE = {
  name: '',
  alert: ''
}

export default (state = BLANK_STATE, action) => {
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
