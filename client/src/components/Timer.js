import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

const mapStateToProps = state => ({
  startTime: state.timer.startTime,
  endTime: state.timer.endTime,
  isActive: state.timer.isActive,
  accumulatedTime: state.timer.accumulatedTime,
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
      return this.props.accumulatedTime
    } else if (this.props.startTime) {
      return this.props.accumulatedTime + (moment.now() - this.props.startTime)
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
    if (nextProps.isActive !== this.state.isActive) {
      if (nextProps.isActive) {
        this.initTimerInterval()
      } else {
        this.clearTimerInterval()
      }
    }
    if (nextProps.accumulatedTime !== this.state.accumulatedTime) {
      this.setState({elapsedTime: nextProps.accumulatedTime})
    }
  }

  tick() {
    const elapsedTime = this.props.accumulatedTime + (moment.now() - this.props.startTime)
    this.setState({elapsedTime})
  }

  getDisplayTime() {
    return moment.utc(this.state.elapsedTime).format("HH:mm:ss")
  }

  render() {
    return (
      <div>
        <h3>{this.props.isActive ? 'Active' : 'Inactive'}</h3>
        <p>Time Elapsed: {this.getDisplayTime()}</p>
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer)