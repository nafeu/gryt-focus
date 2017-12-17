import moment from 'moment'
import {
  ALARM,
  DISPLAY_NAMES
} from './constants'
import {
  START_TIMER,
  STOP_TIMER,
  RESET_TIMER,
  TOGGLE_MODE,
  SET_SESSION_LENGTH,
  ACTIVATE_ALARM,
  DEACTIVATE_ALARM,
  TICK_TIMER
} from './action-types'
import { getNextIndex, getMsByMins } from '../../helpers'

const BLANK_STATE = {
  startTime: null,
  endTime: null,
  isActive: false,
  elapsedTime: null,
  accumulatedTime: 0,
  mode: ALARM,
  sessionLength: getMsByMins(25),
  alarm: false
}

function reducer (state = BLANK_STATE, action) {
  const now = moment.now()
  switch (action.type) {
    case START_TIMER:
      if (state.isActive) {
        return state
      } else {
        return {
          ...state,
          startTime: now,
          elapsedTime: now,
          endTime: null,
          isActive: true
        }
      }

    case TICK_TIMER:
      return {
        ...state,
        elapsedTime: now - state.startTime
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
        elapsedTime: 0,
        accumulatedTime: 0
      }

    case TOGGLE_MODE:
      return {
        ...state,
        mode: getNextIndex(state.mode, DISPLAY_NAMES.length)
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

export default reducer
