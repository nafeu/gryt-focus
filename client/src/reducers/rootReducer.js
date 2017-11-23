import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import timer from './TimerReducers'
import task from './TaskReducers'
import efficiency from './EfficiencyReducers'

export default combineReducers({
  routing: routerReducer,
  timer,
  task,
  efficiency
})