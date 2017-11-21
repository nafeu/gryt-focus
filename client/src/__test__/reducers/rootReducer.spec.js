import rootReducer from '../../reducers/rootReducer'
import timer from '../../reducers/TimerReducers'
import { createStore } from 'redux'

describe('Root reducer', () => {
  it('combines reducers correctly', () => {
    let store = createStore(rootReducer)

    expect(store.getState().timer).toEqual({
      "endTime": null,
      "isActive": false,
      "startTime": null
    })

    const action = { type: 'TOGGLE_TIMER' }
    store.dispatch(action)
    expect(store.getState().timer).toEqual(timer(undefined, action))

  })
})


