import reducer from '../../reducers/TaskReducers'
import * as types from '../../constants/ActionTypes'

describe('Reducers for Task component', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        name: ""
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
})
