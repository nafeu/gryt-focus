import { actionChannel, call, take, put, race } from 'redux-saga/effects'
import {
  START_TIMER,
  STOP_TIMER
} from '../../constants/actionTypes'
import { tick } from './actions'

// wait :: Number -> Promise
const wait = ms => (
  new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
)

function * runTimer () {
  const channel = yield actionChannel(START_TIMER)

  while (yield take(channel)) {
    while (true) {
      const winner = yield race({
        stopped: take(STOP_TIMER),
        tick: call(wait, 1000)
      })

      if (!winner.stopped) {
        yield put(tick())
      } else {
        break
      }
    }
  }
}

export default runTimer
