import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  toggleTimer,
} from '../actions/TimerActions'

const mapStateToProps = state => ({
  startTime: state.timer.startTime,
  endTime: state.timer.endTime,
  isActive: state.timer.isActive,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleTimer,
}, dispatch)

export class Timer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      timerInterval: null,
      active: props.isActive,
      elapsedTime: this.getElapsedTime()
    }

    this.toggleTimer = this.toggleTimer.bind(this)
    this.tick = this.tick.bind(this)
  }

  getElapsedTime() {
    if (this.props.startTime && this.props.endTime) {
      return this.props.endTime - this.props.startTime
    } else if (this.props.startTime) {
      return moment.now() - this.props.startTime
    }
    return 0
  }

  componentDidMount() {
    if (this.state.active) {
      this.initTimerInterval()
    }
  }

  componentWillUnmount() {
    this.clearTimerInterval()
  }

  clearTimerInterval() {
    clearInterval(this.state.timerInterval)
    this.setState({
      timerInterval: null,
      active: false
    })
  }

  initTimerInterval() {
    let timerInterval = setInterval(this.tick, 1000)
    this.setState({
      timerInterval,
      active: true
    })
  }

  toggleTimer() {
    if (this.state.active) {
      this.clearTimerInterval()
    } else {
      this.initTimerInterval()
    }
    this.props.toggleTimer()
  }

  tick() {
    const elapsedTime = moment.now() - this.props.startTime
    this.setState({elapsedTime})
  }

  getDisplayTime() {
    return moment.utc(this.state.elapsedTime).format("HH:mm:ss")
  }

  render() {
    return (
      <div>
        <h3>Status</h3>
        <p>Time Elapsed: {this.getDisplayTime()}</p>
        <p>Active: {this.props.isActive ? 'YES' : 'NO'}</p>
        <p>
          <button onClick={this.toggleTimer}>Toggle</button>
        </p>
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer)