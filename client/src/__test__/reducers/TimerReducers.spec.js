import reducer from '../../reducers/TimerReducers'
import * as types from '../../constants/ActionTypes'

describe('Reducers for Timer component', () => {
  let newState

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      accumulatedTime: 0,
      endTime: null,
      isActive: false,
      startTime: null,
      mode: 1,
      sessionLength: 1500000,
      alarm: false
    })
  })

  it('should handle START_TIMER', () => {
    newState = reducer(
      {
        isActive: false
      },
      {
        type: types.START_TIMER
      }
    )
    expect(newState.isActive).toBeTruthy()
    expect(newState.startTime.toString()).toHaveLength(13)
    expect(newState.endTime).toBeNull()
    newState = reducer(
      {
        isActive: true,
        startTime: 1333065600000,
        endTime: null
      },
      {
        type: types.START_TIMER
      }
    )
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

    newState = reducer(
      {
        endTime: 1333065700000,
        startTime: 1333065600000,
        isActive: false
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

  it('should handle TOGGLE_MODE', () => {
    newState = reducer(
      {
        mode: 1
      },
      {
        type: types.TOGGLE_MODE
      }
    )
    expect(newState).toEqual({
      mode: 0
    })
  })

  it('should handle SET_SESSION_LENGTH', () => {
    newState = reducer(
      {
        sessionLength: 0
      },
      {
        type: types.SET_SESSION_LENGTH,
        payload: {
          sessionLength: 1
        }
      }
    )
    expect(newState).toEqual({
      sessionLength: 60000
    })
  })

  it('should handle ACTIVATE_ALARM', () => {
    newState = reducer(
      {
        alarm: false
      },
      {
        type: types.ACTIVATE_ALARM
      }
    )
    expect(newState).toEqual({
      alarm: true
    })
  })

  it('should handle DEACTIVATE_ALARM', () => {
    newState = reducer(
      {
        alarm: true
      },
      {
        type: types.DEACTIVATE_ALARM
      }
    )
    expect(newState).toEqual({
      alarm: false
    })
  })
})