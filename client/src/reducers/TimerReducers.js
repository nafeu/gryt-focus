import moment from 'moment';
import {
  START_TIMER,
  STOP_TIMER,
  RESET_TIMER,
  TOGGLE_MODE,
  SET_SESSION_LENGTH,
  ACTIVATE_ALARM,
  DEACTIVATE_ALARM
} from '../constants/actionTypes'
import * as modes from '../constants/TimerConstants'
import { getNextIndex, getMsByMins } from '../helpers'

const initialState = {
  startTime: null,
  endTime: null,
  isActive: false,
  accumulatedTime: 0,
  mode: modes.ALARM,
  sessionLength: getMsByMins(25),
  alarm: false
}

export default (state = initialState, action) => {
  const now = moment.now()
  switch (action.type) {
    case START_TIMER:
      if (state.isActive) {
        return state
      }
      else {
        return {
          ...state,
          startTime: now,
          endTime: null,
          isActive: true
        }
      }

    case STOP_TIMER:
      if (state.isActive) {
        return {
          ...state,
          endTime: now,
          isActive: false,
          accumulatedTime: state.accumulatedTime + (now - state.startTime)
        }
      } else {
        return state
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
        mode: getNextIndex(state.mode, modes.DISPLAY_NAMES.length)
      }

    case SET_SESSION_LENGTH:
      return {
        ...state,
        sessionLength: getMsByMins(action.payload.sessionLength)
      }

    case ACTIVATE_ALARM:
      return {
        ...state,
        alarm: true
      }

    case DEACTIVATE_ALARM:
      return {
        ...state,
        alarm: false
      }

    default:
      return state
  }
}