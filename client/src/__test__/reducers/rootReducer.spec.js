import rootReducer from '../../reducers/rootReducer'
import timer from '../../reducers/TimerReducers'
import { createStore } from 'redux'

describe('Root reducer', () => {
  it('combines reducers correctly', () => {
    let store = createStore(rootReducer)

    expect(store.getState().timer).toEqual({
      accumulatedTime: 0,
      endTime: null,
      isActive: false,
      startTime: null,
      mode: 0,
      sessionLength: 3000
    })

    const action = { type: 'TOGGLE_TIMER' }
    store.dispatch(action)
    expect(store.getState().timer).toEqual(timer(undefined, action))

  })
})


