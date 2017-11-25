import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setTask } from '../actions/TaskActions'
import { startTimer, stopTimer } from '../actions/TimerActions'
import * as modes from '../constants/TimerConstants'

const mapStateToProps = state => ({
  name: state.task.name,
  isActive: state.timer.isActive,
  mode: state.timer.mode
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setTask,
  startTimer,
  stopTimer
}, dispatch)

export class Task extends React.Component {

  constructor(props) {
    super(props)

    this.handleBlur = this.handleBlur.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleBlur(e) {
    e.preventDefault()
    this.props.setTask(e.target.value)
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.target.blur()
      if (!this.props.isActive) {
        this.props.startTimer()
      }
    }
  }

  handleChange(e) {
    e.preventDefault()
    if (this.props.isActive) {
      this.props.stopTimer()
    }
  }

  render() {

    const alarmLengthInput = (
      <p>
        <input
          type="number"
          min="0"
          placeholder="Enter session length..."
        />
      </p>
    )

    const taskInput = (
      <p>
        <input
          type="text"
          placeholder="Enter a task..."
          defaultValue={this.props.name}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      </p>
    )

    return (
      <div>
        <h3>Task</h3>
        {this.props.mode === modes.ALARM ? alarmLengthInput : ""}
        {taskInput}
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Task)