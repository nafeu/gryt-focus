import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDisplayTime, getTimeSinceStart } from '../helpers'

const mapStateToProps = state => ({
  startTime: state.timer.startTime,
  endTime: state.timer.endTime,
  isActive: state.timer.isActive,
  accumulatedTime: state.timer.accumulatedTime
})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export class Timer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      timerInterval: null,
      elapsedTime: this.getElapsedTime()
    }

    this.tick = this.tick.bind(this)
  }

  getElapsedTime() {
    if (this.props.startTime && this.props.endTime) {
      return this.props.accumulatedTime
    } else if (this.props.startTime) {
      return this.props.accumulatedTime + getTimeSinceStart(this.props.startTime)
    }
    return this.props.accumulatedTime
  }

  componentDidMount() {
    if (this.props.isActive) {
      this.initTimerInterval()
    }
  }

  componentWillUnmount() {
    this.clearTimerInterval()
  }

  clearTimerInterval() {
    clearInterval(this.state.timerInterval)
    this.setState({timerInterval: null})
  }

  initTimerInterval() {
    let timerInterval = setInterval(this.tick, 1000)
    this.setState({timerInterval})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isActive !== this.props.isActive) {
      if (nextProps.isActive) {
        this.initTimerInterval()
      } else {
        this.clearTimerInterval()
      }
    }
    if (nextProps.accumulatedTime !== this.state.elapsedTime) {
      this.setState({elapsedTime: nextProps.accumulatedTime})
    }
  }

  tick() {
    const elapsedTime = this.props.accumulatedTime + getTimeSinceStart(this.props.startTime)
    this.setState({elapsedTime})
  }

  render() {
    return (
      <div>
        <h3>{this.props.isActive ? 'Active' : 'Inactive'}</h3>
        <p>Time Elapsed: {getDisplayTime(this.state.elapsedTime)}</p>
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer)