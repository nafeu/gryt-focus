import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  toggleTimer,
  resetTimer
} from '../actions/TimerActions'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleTimer,
  resetTimer
}, dispatch)

export class NavButtons extends React.Component {
  render() {
    return (
      <div>
        <h3>NavButtons</h3>
        <p>
          <button onClick={this.props.toggleTimer}>Toggle</button>
          <button onClick={this.props.resetTimer}>Reset</button>
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