import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import timer from './TimerReducers'

export default combineReducers({
  routing: routerReducer,
  timer
})