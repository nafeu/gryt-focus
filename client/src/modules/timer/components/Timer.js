import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDisplayTime, getTimeSinceStart, getElapsedTime } from '../../../helpers'
import { stopTimer, activateAlarm } from '../actions'
import * as modes from '../constants'

export class Timer extends React.Component {
  // constructor (props) {
  //   super(props)
  //
  //   this.state = {
  //     timerInterval: null,
  //     elapsedTime: getElapsedTime(this.props.startTime, this.props.endTime, this.props.accumulatedTime)
  //   }
  //
  //   this.tick = this.tick.bind(this)
  // }

  // componentDidMount () {
  //   if (this.props.isActive) {
  //     this.initTimerInterval()
  //   }
  // }
  //
  // componentWillUnmount () {
  //   this.clearTimerInterval()
  // }
  //
  // clearTimerInterval () {
  //   clearInterval(this.state.timerInterval)
  //   this.setState({ timerInterval: null })
  // }
  //
  // initTimerInterval () {
  //   let timerInterval = setInterval(this.tick, 1000)
  //   this.setState({ timerInterval })
  // }
  //
  // componentWillReceiveProps (nextProps) {
  //   if (nextProps.isActive !== this.props.isActive) {
  //     if (nextProps.isActive) {
  //       this.initTimerInterval()
  //     } else {
  //       this.clearTimerInterval()
  //     }
  //   }
  //   if (nextProps.accumulatedTime !== this.state.elapsedTime) {
  //     this.setState({ elapsedTime: nextProps.accumulatedTime })
  //   }
  // }
  //
  // tick () {
  //   const elapsedTime = this.props.accumulatedTime + getTimeSinceStart(this.props.startTime)
  //   if ((this.props.mode === modes.ALARM) &&
  //     (elapsedTime >= this.props.sessionLength)) {
  //     this.props.stopTimer()
  //     this.props.activateAlarm()
  //   } else {
  //     this.setState({ elapsedTime })
  //   }
  // }

  render () {
    return (
      <div>
        <h3>{this.props.isActive ? 'Active' : 'Inactive'}</h3>
        <p>Elapsed: {getDisplayTime(this.props.elapsedTime)}</p>
        <hr/>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  startTime: state.timer.startTime,
  endTime: state.timer.endTime,
  isActive: state.timer.isActive,
  elapsedTime: state.timer.elapsedTime,
  accumulatedTime: state.timer.accumulatedTime,
  sessionLength: state.timer.sessionLength,
  mode: state.timer.mode
})
const mapDispatchToProps = (dispatch) => bindActionCreators({ stopTimer, activateAlarm }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Timer)
