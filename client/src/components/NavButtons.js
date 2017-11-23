import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  toggleTimer,
  resetTimer
} from '../actions/TimerActions'
import { incrementInterruptions } from '../actions/EfficiencyActions'

const mapStateToProps = state => ({
  isActive: state.timer.isActive
})

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleTimer,
  resetTimer,
  incrementInterruptions
}, dispatch)

export class NavButtons extends React.Component {
  render() {
    return (
      <div>
        <h3>NavButtons</h3>
        <p>
          <button onClick={this.props.toggleTimer}>{this.props.isActive ? 'Stop' : 'Start'}</button>
          <button onClick={this.props.resetTimer}>Reset</button>
          <button onClick={this.props.incrementInterruptions}>Interrupt</button>
        </p>
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavButtons)