import moment from 'moment'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getElapsedTime } from '../../../helpers'
import * as focusSessions from '../../../modules/focus-sessions'

class Interaction extends Component {
  constructor (props) {
    super(props)

    this.saveSession = this.saveSession.bind(this)
  }

  saveSession () {
    const length = getElapsedTime(this.props.startTime, this.props.endTime, this.props.accumulatedTime)
    const sessionInfo = {
      name: this.props.name,
      datetime: moment().format('LLLL'),
      interruptions: this.props.interruptions,
      length
    }
    this.props.saveSession(sessionInfo)
  }

  render () {
    const alarmButton = (
      <button className="alarm-button" onClick={this.props.deactivateAlarm}>ALARM ACTIVE! CLICK TO SNOOZE</button>
    )

    return (
      <div>
        <h3>Interaction</h3>
        <p>
          <button
            className="toggle-button"
            onClick={() => this.props.toggleTimer(this.props.isActive)}>
            {this.props.isActive ? 'Stop' : 'Start'}
          </button>
          <button onClick={this.saveSession}>Save</button>
          <button onClick={this.props.resetTimer}>Reset</button>
          <button
            onClick={this.props.toggleMode}>Mode: {focusSessions.constants.DISPLAY_NAMES[this.props.mode]}</button>
          {this.props.alarm ? alarmButton : ''}
        </p>
        <hr/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isActive: state.focusSessions.isActive,
  mode: state.focusSessions.mode,
  alarm: state.focusSessions.alarm,
  accumulatedTime: state.focusSessions.accumulatedTime,
  startTime: state.focusSessions.startTime,
  endTime: state.focusSessions.endTime,
  name: state.tasks.name
})
const mapDispatchToProps = dispatch => bindActionCreators({
  toggleTimer: focusSessions.actions.toggleTimer,
  resetTimer: focusSessions.actions.resetTimer,
  toggleMode: focusSessions.actions.toggleMode,
  deactivateAlarm: focusSessions.actions.deactivateAlarm,
  stopTimer: focusSessions.actions.stopTimer
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Interaction)
