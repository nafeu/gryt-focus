import moment from 'moment'
import {
  ALARM,
  TIMER_MODES
} from './constants'
import {
  START_SESSION,
  TICK_SESSION,
  PAUSE_SESSION,
  RESUME_SESSION,
  END_SESSION,
  CLEAR_SESSION,
  UPDATE_SESSION_LENGTH,
  TOGGLE_TIMER_MODE,
  ACTIVATE_ALARM,
  DEACTIVATE_ALARM
} from './action-types'
import { getMsByMins, getNextElement } from '../helpers'

const initialState = {
  isActive: false,
  isPaused: false,
  focusIntervals: [],
  elapsedDuration: 0,
  timerMode: ALARM,
  sessionLength: getMsByMins(25),
  alarm: false
}

function reducer (state = initialState, action) {
  const now = moment.now()
  switch (action.type) {
    case START_SESSION: {
      return {
        ...state,
        isActive: true,
        focusIntervals: [{ startTime: now }]
      }
    }
    case TICK_SESSION: {
      const firstFocusInterval = state.focusIntervals[0]
      return {
        ...state,
        elapsedDuration: now - firstFocusInterval.startTime
      }
    }
    case PAUSE_SESSION: {
      const lastFocusInterval = state.focusIntervals.slice(-1)[0]
      lastFocusInterval.endTime = now
      return {
        ...state,
        isPaused: true,
        focusIntervals: state.focusIntervals
      }
    }
    case RESUME_SESSION: {
      return {
        ...state,
        isPaused: false,
        focusIntervals: state.focusIntervals.concat([{ startTime: now }])
      }
    }
    case END_SESSION: {
      const lastFocusInterval = state.focusIntervals.slice(-1)[0]
      lastFocusInterval.endTime = now
      return {
        ...state,
        isActive: false,
        isPaused: false,
        focusIntervals: state.focusIntervals
      }
    }
    case CLEAR_SESSION: {
      return {
        ...state,
        focusIntervals: [],
        elapsedDuration: 0
      }
    }
    case TOGGLE_TIMER_MODE: {
      return {
        ...state,
        timerMode: getNextElement(state.timerMode, TIMER_MODES)
      }
    }
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

    default: {
      return state
    }
  }
}

export default reducer
