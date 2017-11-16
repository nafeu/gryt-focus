import React from 'react'
import { push } from 'react-router-redux'
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
  changePage: () => push('/about-us')
}, dispatch)

class Timer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      timerInterval: null,
      active: props.isActive,
      elapsedTime: props.startTime ? (moment.now() - props.startTime) : 0
    }

    this.toggleTimer = this.toggleTimer.bind(this)
    this.tick = this.tick.bind(this)
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
      active: !this.state.active
    })
  }

  initTimerInterval() {
    let timerInterval = setInterval(this.tick, 1000)
    this.setState({
      timerInterval,
      active: !this.state.active
    })
  }

  toggleTimer() {
    if (this.props.isActive) {
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
        <p>Time Elapsed: {this.getDisplayTime()}</p>
        <p>Active: {this.props.isActive ? 'YES' : 'NO'}</p>
        <p>
          <button onClick={this.toggleTimer}>Toggle</button>
        </p>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer)