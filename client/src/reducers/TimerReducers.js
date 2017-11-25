import moment from 'moment';
import {
  TOGGLE_TIMER,
  START_TIMER,
  STOP_TIMER,
  RESET_TIMER,
  TOGGLE_MODE
} from '../constants/actionTypes'
import * as modes from '../constants/TimerConstants'

function getNextMode(index) {
  if (index === (modes.displayNames.length - 1)) {
    return 0
  } else {
    return index + 1
  }
}

const initialState = {
  startTime: null,
  endTime: null,
  isActive: false,
  accumulatedTime: 0,
  mode: modes.STOPWATCH
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

    case TOGGLE_MODE:
      return {
        ...state,
        mode: getNextMode(state.mode)
      }

    default:
      return state
  }
}