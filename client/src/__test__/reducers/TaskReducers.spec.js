import reducer from '../../app/task/TaskReducers'
import * as types from '../../constants/ActionTypes'

describe('Reducers for Task component', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        name: "",
        alert: ""
      }
    )
  })

  it('should handle SET_TASK', () => {
    let newState

    newState = reducer([], {
      type: types.SET_TASK,
      payload: {
        name: "foo"
      }
    })
    expect(newState.name).toEqual("foo")

    newState = reducer(
      {
        name: "foo"
      },
      {
        type: types.SET_TASK,
        payload: {
          name: "bar"
        }
      }
    )
    expect(newState.name).toEqual("bar")
  })

  it('should handle SET_ALERT', () => {
    let newState

    newState = reducer([], {
      type: types.SET_ALERT,
      payload: {
        message: "foo"
      }
    })
    expect(newState.alert).toEqual("foo")

    newState = reducer(
      {
        alert: "foo"
      },
      {
        type: types.SET_ALERT,
        payload: {
          message: "bar"
        }
      }
    )
    expect(newState.alert).toEqual("bar")
  })
})
