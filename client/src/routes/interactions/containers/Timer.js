import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as focusSessions from '../../../modules/focus-sessions'
import Timer from '../components/Timer'

export class TimerContainer extends Component {
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
  //     this.props.endSession()
  //     this.props.activateAlarm()
  //   } else {
  //     this.setState({ elapsedTime })
  //   }
  // }

  render () {
    return (
      <Timer
        { ...this.props.state }
      />
    )
  }
}

const mapStateToProps = state => ({ state: state.focusSessions })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(focusSessions.actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(TimerContainer)
