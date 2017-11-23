import moment from 'moment';
import {
  TOGGLE_TIMER,
  START_TIMER,
  STOP_TIMER,
  RESET_TIMER
} from '../constants/actionTypes'

const initialState = {
  startTime: null,
  endTime: null,
  isActive: false,
  accumulatedTime: 0
}

export default (state = initialState, action) => {
  const now = moment.now()
  switch (action.type) {
    case TOGGLE_TIMER:
      return {
        ...state,
        startTime: state.isActive ? state.startTime : now,
        endTime: state.isActive ? now : null,
        isActive: !state.isActive,
        accumulatedTime: state.isActive ? (state.accumulatedTime + (now - state.startTime)) : state.accumulatedTime
      }

    case START_TIMER:
      return {
        ...state,
        startTime: now,
        endTime: null,
        isActive: true,
      }

    case STOP_TIMER:
      return {
        ...state,
        endTime: now,
        isActive: false,
        accumulatedTime: state.accumulatedTime + (now - state.startTime)
      }

    case RESET_TIMER:
      return {
        ...state,
        startTime: null,
        endTime: null,
        isActive: false,
        accumulatedTime: 0
      }

    default:
      return state
  }
}