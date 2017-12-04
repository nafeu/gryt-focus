import reducer from '../../reducers/EfficiencyReducers'
import * as types from '../../constants/ActionTypes'

describe('Reducers for Efficiency component', () => {
  let newState

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      interruptions: 0,
      lastInterruption: null
    })
  })

  it('should handle INCREMENT_INTERRUPTIONS', () => {
    newState = reducer(
      {
        interruptions: 0
      },
      {
        type: types.INCREMENT_INTERRUPTIONS,
      }
    )
    expect(newState.interruptions).toEqual(1)
  })

  it('should handle RESET_TIMER', () => {
    newState = reducer(
      {
        interruptions: 1
      },
      {
        type: types.RESET_TIMER,
      }
    )
    expect(newState.interruptions).toEqual(0)
  })
})
