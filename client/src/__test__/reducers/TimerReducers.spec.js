import reducer from '../../reducers/TimerReducers'
import * as types from '../../constants/ActionTypes'

describe('Reducers for Timer component', () => {
  let newState

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      accumulatedTime: 0,
      endTime: null,
      isActive: false,
      startTime: null
    })
  })

  it('should handle TOGGLE_TIMER', () => {
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

  it('should handle START_TIMER', () => {
    newState = reducer([], {type: types.START_TIMER})

    expect(newState.isActive).toBeTruthy()
    expect(newState.startTime.toString()).toHaveLength(13)
    expect(newState.endTime).toBeNull()
  })

  it('should handle STOP_TIMER', () => {
    newState = reducer(
      {
        endTime: null,
        startTime: 1333065600000,
        isActive: true
      },
      {
        type: types.STOP_TIMER
      }
    )

    expect(newState.isActive).toBeFalsy()
    expect(newState.startTime.toString()).toHaveLength(13)
    expect(newState.endTime.toString()).toHaveLength(13)
  })

  it('should handle RESET_TIMER', () => {
    newState = reducer(
      {
        endTime: null,
        startTime: 1333065600000,
        isActive: true
      },
      {
        type: types.RESET_TIMER
      }
    )

    expect(newState).toEqual({
      startTime: null,
      endTime: null,
      isActive: false,
      accumulatedTime: 0
    })
  })
})