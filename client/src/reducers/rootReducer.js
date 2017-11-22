import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import timer from './TimerReducers'
import task from './TaskReducers'

export default combineReducers({
  routing: routerReducer,
  timer,
  task
})