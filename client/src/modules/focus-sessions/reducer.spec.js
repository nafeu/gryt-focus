import * as actions from './actions'
import reducer from './reducer'
import { ALARM, STOPWATCH } from './constants'

describe('reducer', () => {
  const now = 999

  it('returns the initial state if not provided with a state', () => {
    const someAction = { type: 'SOME_ACTION' }

    const nextState = reducer(undefined, someAction)

    expect(nextState).toHaveProperty('isActive', false)
    expect(nextState).toHaveProperty('isPaused', false)
    expect(nextState).toHaveProperty('focusIntervals', [])
    expect(nextState).toHaveProperty('elapsedDuration', 0)
    expect(nextState).toHaveProperty('timerMode', ALARM)
    expect(nextState).toHaveProperty('sessionLength', 25 * 60 * 1000)
    expect(nextState).toHaveProperty('alarm', false)
  })

  it('starts the session', () => {
    Date.now = jest.fn(() => now)
    const startSessionAction = actions.startSession()

    const nextState = reducer(undefined, startSessionAction)

    expect(nextState).toHaveProperty('isActive', true)
    expect(nextState).toHaveProperty('focusIntervals')
    expect(nextState.focusIntervals[0]).toHaveProperty('startTime', now)
  })

  it('updates the elapsed duration', () => {
    Date.now = jest.fn(() => now)
    const tickSessionAction = actions.tickSession()
    const previousState = { focusIntervals: [{ startTime: now - 7 }] }

    const nextState = reducer(previousState, tickSessionAction)

    expect(nextState).toHaveProperty('elapsedDuration', 7)
  })

  it('pauses the session', () => {
    Date.now = jest.fn(() => now)
    const pauseSessionAction = actions.pauseSession()
    const previousState = { focusIntervals: [{ startTime: now - 999 }] }

    const nextState = reducer(previousState, pauseSessionAction)

    expect(nextState).toHaveProperty('isPaused', true)
    expect(nextState).toHaveProperty('focusIntervals')
    expect(nextState.focusIntervals[0]).toHaveProperty('endTime', now)
  })

  it('resumes the paused session', () => {
    Date.now = jest.fn(() => now)
    const resumeSessionAction = actions.resumeSession()
    const previousState = { focusIntervals: [{ startTime: 998, endTime: 999 }] }

    const nextState = reducer(previousState, resumeSessionAction)

    expect(nextState).toHaveProperty('isPaused', false)
    expect(nextState).toHaveProperty('focusIntervals')
    expect(nextState.focusIntervals.slice(-1)[0]).toHaveProperty('startTime', now)
  })

  it('ends the session', () => {
    Date.now = jest.fn(() => now)
    const endSessionAction = actions.endSession()
    const previousState = { focusIntervals: [{ startTime: now - 999 }] }

    const nextState = reducer(previousState, endSessionAction)

    expect(nextState).toHaveProperty('isActive', false)
    expect(nextState).toHaveProperty('focusIntervals')
    expect(nextState.focusIntervals.slice(-1)[0]).toHaveProperty('endTime', now)
  })

  it('clears the session by resetting it to the beginning', () => {
    Date.now = jest.fn(() => now)
    const clearSessionAction = actions.clearSession()
    const previousState = { focusIntervals: [{ startTime: 998, endTime: 999 }] }

    const nextState = reducer(previousState, clearSessionAction)

    expect(nextState).toHaveProperty('focusIntervals', [])
    expect(nextState).toHaveProperty('elapsedDuration', 0)
  })

  it('toggles the alarm modes', () => {
    const toggleModeAction = actions.toggleTimerMode()
    const previousState = { timerMode: ALARM }

    const nextState = reducer(previousState, toggleModeAction)

    expect(nextState).toHaveProperty('timerMode', STOPWATCH)
  })
})
