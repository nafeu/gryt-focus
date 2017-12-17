import moment from 'moment'
import {
  ALARM,
  DISPLAY_NAMES
} from './constants'
import {
  START_SESSION,
  END_SESSION,
  CLEAR_SESSION,
  TOGGLE_MODE,
  UPDATE_SESSION_LENGTH,
  ACTIVATE_ALARM,
  DEACTIVATE_ALARM,
  TICK
} from './action-types'
import { getNextIndex, getMsByMins } from '../../helpers'

const initialState = {
  startTime: null,
  endTime: null,
  isActive: false,
  elapsedTime: null,
  accumulatedTime: 0,
  mode: ALARM,
  sessionLength: getMsByMins(25),
  alarm: false
}

function reducer (state = initialState, action) {
  const now = moment.now()
  switch (action.type) {
    case START_SESSION:
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

    case TICK:
      return {
        ...state,
        elapsedTime: now - state.startTime
      }

    case END_SESSION:
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

    case CLEAR_SESSION:
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

    case UPDATE_SESSION_LENGTH:
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
