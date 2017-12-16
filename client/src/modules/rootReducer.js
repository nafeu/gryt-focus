import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import timer from './timer/reducers'
import task from './task/reducers'
import efficiency from './efficiency/reducers'
import activity from './activity/reducers'

export default combineReducers({
  routing: routerReducer,
  timer,
  task,
  efficiency,
  activity
})
