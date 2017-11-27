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

  it('creates START_TIMER and STOP_TIMER on toggleTimer action', () => {
    const expectedActions = [
      { type: types.START_TIMER },
      { type: types.STOP_TIMER }
    ]
    store.dispatch(actions.toggleTimer(false))
    store.dispatch(actions.toggleTimer(true))
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

  it('creates TOGGLE_MODE action', () => {
    const expectedActions = [
      { type: types.TOGGLE_MODE },
    ]
    store.dispatch(actions.toggleMode())
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('creates SET_SESSION_LENGTH action', () => {
    const expectedActions = [
      {
        type: types.SET_SESSION_LENGTH,
        payload: {
          sessionLength: 60000
        }
      },
    ]
    store.dispatch(actions.setSessionLength(60000))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('creates ACTIVATE_ALARM action', () => {
    const expectedActions = [
      { type: types.ACTIVATE_ALARM },
    ]
    store.dispatch(actions.activateAlarm())
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('creates DEACTIVATE_ALARM action', () => {
    const expectedActions = [
      { type: types.DEACTIVATE_ALARM },
    ]
    store.dispatch(actions.deactivateAlarm())
    expect(store.getActions()).toEqual(expectedActions)
  })
})