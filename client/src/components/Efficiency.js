import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getElapsedTime, calculateFocus } from '../helpers'

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

    const elapsedTime = getElapsedTime(this.startTime, this.endTime, this.accumulatedTime)

    this.state = {
      timerInterval: null,
      focus: calculateFocus(elapsedTime, this.props.interruptions)
    }

    this.tick = this.tick.bind(this)
  }

  tick() {
    const elapsedTime = getElapsedTime(this.startTime, this.endTime, this.accumulatedTime)
    const focus = calculateFocus(elapsedTime, this.props.interruptions)
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
      const focus = calculateFocus(nextProps.accumulatedTime, nextProps.interruptions)
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