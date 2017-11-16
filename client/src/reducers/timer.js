import moment from 'moment';
import { TOGGLE_TIMER } from '../constants/actionTypes'

const initialState = {
  startTime: null,
  endTime: null,
  isActive: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_TIMER:
      return {
        ...state,
        startTime: state.isActive ? state.startTime : moment.now(),
        endTime: state.isActive ? moment.now() : null,
        isActive: !state.isActive
      }

    default:
      return state
  }
}