import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  toggleTimer,
  resetTimer,
  toggleMode,
  stopTimer,
  deactivateAlarm
} from '../actions/TimerActions'
import { incrementInterruptions } from '../actions/EfficiencyActions'
import { saveSession } from '../actions/ActivityActions'
import * as modes from '../constants/TimerConstants'
import moment from 'moment'
import { getElapsedTime, calculateFocus } from '../helpers'

const mapStateToProps = state => ({
  isActive: state.timer.isActive,
  mode: state.timer.mode,
  alarm: state.timer.alarm,
  name: state.task.name,
  accumulatedTime: state.timer.accumulatedTime,
  startTime: state.timer.startTime,
  endTime: state.timer.endTime,
  interruptions: state.efficiency.interruptions
})

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleTimer,
  resetTimer,
  incrementInterruptions,
  toggleMode,
  deactivateAlarm,
  saveSession,
  stopTimer,
}, dispatch)

export class NavButtons extends React.Component {

  constructor(props) {
    super(props)

    this.saveSession = this.saveSession.bind(this)
  }

  saveSession() {
    const length = getElapsedTime(this.props.startTime, this.props.endTime, this.props.accumulatedTime)
    const focus = calculateFocus(length, this.props.interruptions)
    const sessionInfo = {
      name: this.props.name,
      datetime: moment().format('LLLL'),
      interruptions: this.props.interruptions,
      length,
      focus
    }
    this.props.saveSession(sessionInfo)
  }

  render() {

    const alarmButton = (
      <button className="alarm-button" onClick={this.props.deactivateAlarm}>ALARM ACTIVE! CLICK TO SNOOZE</button>
    )

    return (
      <div>
        <h3>NavButtons</h3>
        <p>
          <button
            className="toggle-button"
            onClick={() => this.props.toggleTimer(this.props.isActive)}>
            {this.props.isActive ? 'Stop' : 'Start'}
          </button>
          <button onClick={this.saveSession}>Save</button>
          <button onClick={this.props.resetTimer}>Reset</button>
          <button onClick={this.props.incrementInterruptions}>Interrupt</button>
          <button onClick={this.props.toggleMode}>Mode: {modes.DISPLAY_NAMES[this.props.mode]}</button>
          {this.props.alarm ? alarmButton : ""}
        </p>
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavButtons)