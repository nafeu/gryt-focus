import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/TimerActions'
import * as types from '../../constants/ActionTypes'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Timer actions', () => {
  let store

  beforeEach(() => {
    store = mockStore({timer:{}})
  })

  it('creates TOGGLE_TIMER action', () => {
    const expectedActions = [
      { type: types.TOGGLE_TIMER },
    ]
    store.dispatch(actions.toggleTimer())
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('creates START_TIMER action', () => {
    const expectedActions = [
      { type: types.START_TIMER },
    ]
    store.dispatch(actions.startTimer())
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('creates STOP_TIMER action', () => {
    const expectedActions = [
      { type: types.STOP_TIMER },
    ]
    store.dispatch(actions.stopTimer())
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('creates RESET_TIMER action', () => {
    const expectedActions = [
      { type: types.RESET_TIMER },
    ]
    store.dispatch(actions.resetTimer())
    expect(store.getActions()).toEqual(expectedActions)
  })
})