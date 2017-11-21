import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/TimerActions'
import * as types from '../../constants/ActionTypes'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Timer actions', () => {
  it('creates TOGGLE_TIMER action', () => {
    const expectedActions = [
      { type: types.TOGGLE_TIMER },
    ]
    const store = mockStore({timer:{}})

    store.dispatch(actions.toggleTimer())
    expect(store.getActions()).toEqual(expectedActions)
  })
})