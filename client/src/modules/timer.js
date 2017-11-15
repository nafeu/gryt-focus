export const TOGGLE_TIMER = 'timer/TOGGLE_TIMER'
export const INCREMENT_TIMER = 'timer/INCREMENT_TIMER'

const initialState = {
  secondsElapsed: 0,
  isActive: false
}

// Reducers
export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_TIMER:
      return {
        ...state,
        isActive: !state.isActive
      }

    case INCREMENT_TIMER:
      return {
        ...state,
        secondsElapsed: state.secondsElapsed + 1
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

export const incrementTimer = () => {
  return dispatch => {
    dispatch({
      type: INCREMENT_TIMER
    })
  }
}