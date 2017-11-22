import reducer from '../../reducers/TimerReducers'
import * as types from '../../constants/ActionTypes'

describe('Reducers for Timer component', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        endTime: null,
        startTime: null,
        isActive: false
      }
    )
  })

  it('should handle TOGGLE_TIMER', () => {
    let newState

    newState = reducer([], {type: types.TOGGLE_TIMER})

    expect(newState.isActive).toBeTruthy()
    expect(newState.startTime.toString()).toHaveLength(13)
    expect(newState.endTime).toBeNull()

    newState = reducer(
      {
        endTime: null,
        startTime: 1333065600000,
        isActive: true
      },
      {
        type: types.TOGGLE_TIMER
      }
    )

    expect(newState.isActive).toBeFalsy()
    expect(newState.startTime.toString()).toHaveLength(13)
    expect(newState.endTime.toString()).toHaveLength(13)
    expect(newState.endTime).toBeGreaterThan(newState.startTime)
  })
})