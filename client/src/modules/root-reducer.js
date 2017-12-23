import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import * as focusSessions from './focus-sessions'
import * as tasks from './tasks'

export default combineReducers({
  routing: routerReducer,
  focusSessions: focusSessions.reducer,
  tasks: tasks.reducer
})
