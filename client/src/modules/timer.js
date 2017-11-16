import moment from 'moment';

export const TOGGLE_TIMER = 'timer/TOGGLE_TIMER'

const initialState = {
  startTime: null,
  endTime: null,
  isActive: false
}

// Reducers
export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_TIMER:
      return {
        ...state,
        startTime: state.isActive ? state.startTime : moment.now(),
        endTime: state.isActive ? moment.now() : null,
        isActive: !state.isActive
      }

    default:
      return state
  }
}

// Actions
export const toggleTimer = () => {
  return dispatch => {
    dispatch({
      type: TOGGLE_TIMER
    })
  }
}