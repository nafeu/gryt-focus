import {
  START_SESSION,
  TICK,
  END_SESSION,
  CLEAR_SESSION,
  UPDATE_SESSION_LENGTH,
  ACTIVATE_ALARM,
  DEACTIVATE_ALARM, PAUSE_SESSION, RESUME_SESSION
} from './action-types'

export const startSession = () => ({ type: START_SESSION })
export const tick = () => ({ type: TICK })
export const pauseSession = () => ({ type: PAUSE_SESSION })
export const resumeSession = () => ({ type: RESUME_SESSION })
export const endSession = () => ({ type: END_SESSION })
export const clearSession = () => ({ type: CLEAR_SESSION })
export const updateSessionLength = (sessionLength) => ({
  type: UPDATE_SESSION_LENGTH,
  payload: { sessionLength }
})

export const activateAlarm = () => ({ type: ACTIVATE_ALARM })
export const deactivateAlarm = () => ({ type: DEACTIVATE_ALARM })
