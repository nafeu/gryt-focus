import { SAVE_SESSION } from '../../constants/action-types'

const initialState = {
  log: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_SESSION:
      return {
        ...state,
        log: [...state.log, action.payload.sessionInfo]
      }

    default:
      return state
  }
}
