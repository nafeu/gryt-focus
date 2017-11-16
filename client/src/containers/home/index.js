import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  toggleTimer,
} from '../../modules/timer'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      elapsedTime: props.endTime - props.startTime
    }

    this.toggleTimer = this.toggleTimer.bind(this)
    this.tick = this.tick.bind(this)
  }

  tick() {
    this.setState({elapsedTime: moment.now() - this.props.startTime})
  }

  toggleTimer() {
    if (this.props.isActive) {
      clearInterval(this.state.timer)
    } else {
      let timer = setInterval(this.tick, 1000)
      this.setState({
        timer,
        elapsedTime: this.props.endTime - this.props.startTime
      })
    }
    this.props.toggleTimer()
  }

  getDisplayTime() {
    return moment.utc(this.state.elapsedTime).format("HH:mm:ss")
  }

  render() {
    return (
      <div>
        <h1>Home</h1>

        <p>Time Elapsed: {this.getDisplayTime()}</p>
        <p>Active: {this.props.isActive ? 'YES' : 'NO'}</p>
        <p>Start: {this.props.startTime}</p>
        <p>End: {this.props.endTime}</p>

        <p>
          <button onClick={this.toggleTimer}>Toggle</button>
        </p>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  startTime: state.timer.startTime,
  endTime: state.timer.endTime,
  isActive: state.timer.isActive,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleTimer,
  changePage: () => push('/about-us')
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)