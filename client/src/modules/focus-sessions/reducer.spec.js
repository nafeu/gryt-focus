import * as actions from './actions'
import reducer from './reducer'
import { ALARM } from './constants'

describe('reducer', () => {
  const now = 999

  it('returns the initial state if not provided with a state', () => {
    const someAction = { type: 'SOME_ACTION' }

    const nextState = reducer(undefined, someAction)

    expect(nextState).toHaveProperty('focusIntervals', [])
    expect(nextState).toHaveProperty('elapsedDuration', 0)
    expect(nextState).toHaveProperty('mode', ALARM)
    expect(nextState).toHaveProperty('sessionLength', 25 * 60 * 1000)
    expect(nextState).toHaveProperty('alarm', false)
  })

  it('starts a session', () => {
    Date.now = jest.fn(() => now)
    const startSessionAction = actions.startSession()

    const nextState = reducer(undefined, startSessionAction)

    expect(nextState).toHaveProperty('focusIntervals')
    expect(nextState.focusIntervals[0]).toHaveProperty('startTime', now)
  })

  it('ends a session', () => {
    Date.now = jest.fn(() => now)
    const endSessionAction = actions.endSession()
    const previousState = { focusIntervals: [{ startTime: now - 999 }] }

    const nextState = reducer(previousState, endSessionAction)

    expect(nextState).toHaveProperty('focusIntervals')
    expect(nextState.focusIntervals.slice(-1)[0]).toHaveProperty('endTime', now)
  })

  it('updates the elapsed duration', () => {
    Date.now = jest.fn(() => now)
    const tickSessionAction = actions.tickSession()
    const previousState = { focusIntervals: [{ startTime: now - 7 }] }

    const nextState = reducer(previousState, tickSessionAction)

    expect(nextState).toHaveProperty('elapsedDuration', 7)
  })
})
