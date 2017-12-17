// import * as actions from './actions'
import reducer from './reducer'
import { ALARM } from './constants'

describe('reducer', () => {
  it('returns the initial state if not provided with a state', () => {
    const someAction = { type: 'SOME_ACTION' }

    const nextState = reducer(undefined, someAction)

    expect(nextState).toHaveProperty('isActive', false)
    expect(nextState).toHaveProperty('mode', ALARM)
    expect(nextState).toHaveProperty('sessionLength', 1500000)
    expect(nextState).toHaveProperty('alarm', false)
  })
})
