import { actionChannel, call, take, put, race } from 'redux-saga/effects'
import {
  START_SESSION,
  PAUSE_SESSION,
  RESUME_SESSION,
  END_SESSION
} from './action-types'
import { tickSession } from './actions'

// wait :: Number -> Promise
const wait = ms => (
  new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
)

function * runFocusSession () {
  // const channel = yield actionChannel()

  while (yield race({
    start: take(START_SESSION),
    resume: take(RESUME_SESSION)
  })) {
    while (true) {
      const winner = yield race({
        paused: take(PAUSE_SESSION),
        stopped: take(END_SESSION),
        tick: call(wait, 1000)
      })

      if (!(winner.stopped || winner.paused)) {
        yield put(tickSession())
      } else {
        break
      }
    }
  }
}

export { runFocusSession }
