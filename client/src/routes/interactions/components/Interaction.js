import React from 'react'
import PropTypes from 'prop-types'

import * as focusSessions from '../../../modules/focus-sessions'

const Interaction = (props) => {
  const {
    isFocusSessionActive,
    timerMode,
    alarm,
    startSession,
    endSession,
    clearSession,
    deactivateAlarm,
    toggleTimerMode
  } = props

  const AlarmSnoozeButton = () => (
    <button className="alarm-button" onClick={deactivateAlarm}>ALARM ACTIVE! CLICK TO SNOOZE</button>
  )

  return (
    <div>
      <h3>Interaction</h3>
      <p>
        <button onClick={() => isFocusSessionActive ? endSession() : startSession()}>
          {isFocusSessionActive ? 'End' : 'Start'}
        </button>
        <button disabled={isFocusSessionActive} onClick={clearSession}>Clear</button>
        <button onClick={toggleTimerMode}>
          Mode: {focusSessions.constants.TIMER_MODE_DISPLAYS[timerMode]}
        </button>
        {alarm ? <AlarmSnoozeButton/> : ''}
      </p>
      <hr/>
    </div>
  )
}

Interaction.propTypes = {
  isFocusSessionActive: PropTypes.bool.isRequired,
  timerMode: PropTypes.number.isRequired,
  alarm: PropTypes.bool.isRequired,
  startSession: PropTypes.func.isRequired,
  endSession: PropTypes.func.isRequired,
  clearSession: PropTypes.func.isRequired,
  deactivateAlarm: PropTypes.func.isRequired,
  toggleTimerMode: PropTypes.func.isRequired
}

export default Interaction
