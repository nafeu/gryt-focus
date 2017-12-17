import React from 'react'
import * as focusSessions from '../../../modules/focus-sessions'

function Interaction ({ state, actions }) {
  const {
    isActive,
    mode,
    alarm,
    accumulatedTime,
    startTime,
    endTime,
    name
  } = state

  const {
    toggleTimer,
    resetTimer,
    toggleMode,
    deactivateAlarm,
    stopTimer
  } = actions

  const alarmButton = (
    <button className="alarm-button" onClick={deactivateAlarm}>ALARM ACTIVE! CLICK TO SNOOZE</button>
  )

  return (
    <div>
      <h3>Interaction</h3>
      <p>
        <button
          className="toggle-button"
          onClick={() => toggleTimer(isActive)}
        >
          {isActive ? 'Stop' : 'Start'}
        </button>
        <button onClick={resetTimer}>Reset</button>
        <button
          onClick={toggleMode}>Mode: {focusSessions.constants.DISPLAY_NAMES[mode]}</button>
        {alarm ? alarmButton : ''}
      </p>
      <hr/>
    </div>
  )
}

export default Interaction
