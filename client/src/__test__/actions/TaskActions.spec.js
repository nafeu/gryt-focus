import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/TaskActions'
import * as types from '../../constants/ActionTypes'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Task actions', () => {
  it('creates SET_TASK action', () => {
    const expectedActions = [
      {
        type: types.SET_TASK,
        payload: {
          name: "asdf"
        }
      },
    ]
    const store = mockStore({task:{name: ""}})

    store.dispatch(actions.setTask("asdf"))
    expect(store.getActions()).toEqual(expectedActions)
  })
})