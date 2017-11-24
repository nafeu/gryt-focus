import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/EfficiencyActions'
import * as types from '../../constants/ActionTypes'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Efficiency actions', () => {
  let store

  beforeEach(() => {
    store = mockStore({efficiency:{}})
  })

  it('creates INCREMENT_INTERRUPTIONS action', () => {
    const expectedActions = [
      { type: types.INCREMENT_INTERRUPTIONS },
    ]
    store.dispatch(actions.incrementInterruptions())
    expect(store.getActions()).toEqual(expectedActions)
  })
})