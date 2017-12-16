import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../app/task/TaskActions'
import * as types from '../../constants/ActionTypes'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Task actions', () => {
  let store

  beforeEach(() => {
    store = mockStore({task:{name: ""}})
  })

  it('creates SET_TASK action', () => {
    const expectedActions = [
      {
        type: types.SET_TASK,
        payload: {
          name: "task name"
        }
      },
    ]
    store.dispatch(actions.setTask("task name"))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('creates SET_ALERT action', () => {
    const expectedActions = [
      {
        type: types.SET_ALERT,
        payload: {
          message: "alert message"
        }
      },
    ]
    store.dispatch(actions.setAlert("alert message"))
    expect(store.getActions()).toEqual(expectedActions)
  })
})
