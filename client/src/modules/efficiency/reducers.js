import { INCREMENT_INTERRUPTIONS, RESET_TIMER, START_TIMER } from '../../constants/action-types'
import moment from 'moment'

const initialState = {
  interruptions: 0,
  lastInterruption: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_INTERRUPTIONS:
      return {
        ...state,
        interruptions: state.interruptions + 1,
        lastInterruption: moment.now()
      }

    case RESET_TIMER:
      return {
        ...state,
        interruptions: 0,
        lastInterruption: null
      }

    case START_TIMER:
      return {
        ...state,
        lastInterruption: moment.now()
      }

    default:
      return state
  }
}
