import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import createHistory from 'history/createBrowserHistory'

import rootReducer from './modules/root-reducer'
import * as focusSessions from './modules/focus-sessions'

const sagaMiddleware = createSagaMiddleware()
export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [
  thunk,
  sagaMiddleware,
  routerMiddleware(history)
]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
)

sagaMiddleware.run(focusSessions.sagas.runTimer)

export default store
