import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

const mapStateToProps = state => ({
  interruptions: state.efficiency.interruptions,
  startTime: state.timer.startTime,
  endTime: state.timer.endTime,
  accumulatedTime: state.timer.accumulatedTime,
  isActive: state.timer.isActive
})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export class Efficiency extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      timerInterval: null,
      focus: this.calculateFocus(this.getElapsedTime(), this.props.interruptions)
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

  calculateFocus(timeInMs, interruptions) {
    const oneMinInMs = 60000
    const timeInSecs = ((timeInMs * 0.001) / 60)
    const interruptionsOverTime = (interruptions / timeInSecs)
    const focus = Math.max(Math.round((1 - interruptionsOverTime) * 100), 0)
    if (timeInMs > oneMinInMs && interruptions < Math.floor(timeInMs / oneMinInMs)) {
      return focus + "%"
    }
    return "---"
  }

  tick() {
    const focus = this.calculateFocus(this.getElapsedTime(), this.props.interruptions)
    this.setState({focus})
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
    if (nextProps.accumulatedTime !== this.props.accumulatedTime) {
      const focus = this.calculateFocus(nextProps.accumulatedTime, nextProps.interruptions)
      this.setState({focus})
    }
  }

  render() {
    return (
      <div>
        <h3>Efficiency</h3>
        <p>Interruptions: {this.props.interruptions}</p>
        <p>Focus: {this.state.focus}</p>
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Efficiency)