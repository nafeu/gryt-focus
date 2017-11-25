import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  toggleTimer,
  resetTimer,
  toggleMode
} from '../actions/TimerActions'
import { incrementInterruptions } from '../actions/EfficiencyActions'
import * as modes from '../constants/TimerConstants'

const mapStateToProps = state => ({
  isActive: state.timer.isActive,
  mode: state.timer.mode
})

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleTimer,
  resetTimer,
  incrementInterruptions,
  toggleMode
}, dispatch)

export class NavButtons extends React.Component {
  render() {
    return (
      <div>
        <h3>NavButtons</h3>
        <p>
          <button
            className="toggle-button"
            onClick={() => this.props.toggleTimer(this.props.isActive)}>
            {this.props.isActive ? 'Stop' : 'Start'}
          </button>
          <button onClick={this.props.resetTimer}>Reset</button>
          <button onClick={this.props.incrementInterruptions}>Interrupt</button>
          <button onClick={this.props.toggleMode}>Mode: {modes.DISPLAY_NAMES[this.props.mode]}</button>
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