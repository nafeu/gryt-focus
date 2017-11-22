import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

const mapStateToProps = state => ({
  startTime: state.timer.startTime,
  endTime: state.timer.endTime,
  isActive: state.timer.isActive,
  taskName: state.task.name
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
      return this.props.endTime - this.props.startTime
    } else if (this.props.startTime) {
      return moment.now() - this.props.startTime
    }
    return 0
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
    if (nextProps.isActive !== this.state.isActive) {
      if (nextProps.isActive) {
        this.initTimerInterval()
      } else {
        this.clearTimerInterval()
      }
    }
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
        <p>Current Task: {this.props.taskName}</p>
        <p>Time Elapsed: {this.getDisplayTime()}</p>
        <p>Active: {this.props.isActive ? 'YES' : 'NO'}</p>
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer)