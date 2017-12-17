import { actionChannel, call, take, put, race } from 'redux-saga/effects'
import {
  START_SESSION,
  END_SESSION
} from './action-types'
import { tick } from './actions'

// wait :: Number -> Promise
const wait = ms => (
  new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
)

function * runTimer () {
  const channel = yield actionChannel(START_SESSION)

  while (yield take(channel)) {
    while (true) {
      const winner = yield race({
        stopped: take(END_SESSION),
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

export { runTimer }
