import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getElapsedTime, calculateFocus, initGraphData, updateGraphData } from '../../../helpers'
import PerformanceGraph from './PerformanceGraph'
import moment from 'moment'

const mapStateToProps = state => ({
  interruptions: state.efficiency.interruptions,
  lastInterruption: state.efficiency.lastInterruption,
  startTime: state.timer.startTime,
  endTime: state.timer.endTime,
  accumulatedTime: state.timer.accumulatedTime,
  isActive: state.timer.isActive,
})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export class Efficiency extends React.Component {
  constructor(props) {
    super(props)

    const elapsedTime = getElapsedTime(this.props.startTime, this.props.endTime, this.props.accumulatedTime)

    this.state = {
      timerInterval: null,
      focus: calculateFocus(elapsedTime, this.props.interruptions, this.props.lastInterruption, moment.now()),
      graphData: initGraphData(60)
    }

    this.tick = this.tick.bind(this)
  }

  tick() {
    const elapsedTime = getElapsedTime(this.props.startTime, this.props.endTime, this.props.accumulatedTime)
    const focus = calculateFocus(elapsedTime, this.props.interruptions, this.props.lastInterruption, moment.now())
    this.setState({
      focus,
      graphData: updateGraphData(this.state.graphData, focus)
    })
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
        <PerformanceGraph
          width={500}
          height={500}
          length={1}
          data={this.state.graphData}
        />
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Efficiency)
