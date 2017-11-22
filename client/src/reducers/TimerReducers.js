import moment from 'moment';
import { TOGGLE_TIMER } from '../constants/actionTypes'

const initialState = {
  startTime: null,
  endTime: null,
  isActive: false,
  accumulatedTime: 0
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_TIMER:
      const now = moment.now()
      return {
        ...state,
        startTime: state.isActive ? state.startTime : now,
        endTime: state.isActive ? now : null,
        isActive: !state.isActive,
        accumulatedTime: state.isActive ? (state.accumulatedTime + (now - state.startTime)) : state.accumulatedTime
      }

    default:
      return state
  }
}