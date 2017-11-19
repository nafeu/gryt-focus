import { toggleTimer } from '../../actions/TimerActions'

describe('Actions for Timer component', () => {
  it('creates TOGGLE_TIMER action', () => {
    toggleTimer((action) => {
      expect(action).toEqual({type:"TOGGLE_TIMER"})
    })
  })
})
