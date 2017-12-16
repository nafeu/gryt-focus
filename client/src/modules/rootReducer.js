import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import timer from './timer/reducers'
import task from './task/reducers'

export default combineReducers({
  routing: routerReducer,
  timer,
  task
})
