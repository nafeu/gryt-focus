import moment from 'moment'
import {
  ALARM,
  DISPLAY_NAMES
} from './constants'
import {
  START_SESSION,
  TICK_SESSION,
  END_SESSION,
  CLEAR_SESSION,
  TOGGLE_MODE,
  UPDATE_SESSION_LENGTH,
  ACTIVATE_ALARM,
  DEACTIVATE_ALARM
} from './action-types'
import { getNextIndex, getMsByMins } from '../../helpers'

const initialState = {
  isActive: false,
  focusIntervals: [],
  elapsedDuration: 0,
  mode: ALARM,
  sessionLength: getMsByMins(25),
  alarm: false
}

function reducer (state = initialState, action) {
  const now = moment.now()
  switch (action.type) {
    case START_SESSION:
      return {
        ...state,
        isActive: true,
        focusIntervals: [
          {
            startTime: now
          }
        ]
      }
    case TICK_SESSION:
      const firstFocusInterval = state.focusIntervals[0]
      return {
        ...state,
        elapsedDuration: now - firstFocusInterval.startTime
      }
    case END_SESSION:
      const lastFocusInterval = state.focusIntervals.slice(-1)[0]
      lastFocusInterval.endTime = now
      return {
        ...state,
        isActive: false,
        focusIntervals: state.focusIntervals
      }
    // case CLEAR_SESSION:
    //   return {
    //     ...state,
    //     startTime: null,
    //     endTime: null,
    //     isActive: false,
    //     elapsedTime: 0,
    //     accumulatedTime: 0
    //   }
    //
    // case TOGGLE_MODE:
    //   return {
    //     ...state,
    //     mode: getNextIndex(state.mode, DISPLAY_NAMES.length)
    //   }
    //
    // case UPDATE_SESSION_LENGTH:
    //   return {
    //     ...state,
    //     sessionLength: getMsByMins(action.payload.sessionLength)
    //   }
    //
    // case ACTIVATE_ALARM:
    //   return {
    //     ...state,
    //     alarm: true
    //   }
    //
    // case DEACTIVATE_ALARM:
    //   return {
    //     ...state,
    //     alarm: false
    //   }

    default:
      return state
  }
}

export default reducer
