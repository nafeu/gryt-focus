import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setTask, setAlert } from '../actions/TaskActions'
import { startTimer, stopTimer, setSessionLength } from '../actions/TimerActions'
import * as modes from '../constants/TimerConstants'
import { getMinsByMs } from '../helpers'

const mapStateToProps = state => ({
  name: state.task.name,
  alert: state.task.alert,
  isActive: state.timer.isActive,
  mode: state.timer.mode,
  sessionLength: state.timer.sessionLength
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setTask,
  startTimer,
  stopTimer,
  setSessionLength,
  setAlert
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
      this.props.startTimer()
    }
  }

  handleChange(e) {
    e.preventDefault()
    if (e.target.className === 'task-input') {
      this.props.stopTimer()
    }
    if (e.target.className === 'session-length-input') {
      this.props.stopTimer()
      this.props.setSessionLength(e.target.value)
    }
  }

  render() {

    const sessionLengthInput = (
      <p>
        <input
          className="session-length-input"
          type="number"
          min="0"
          defaultValue={getMinsByMs(this.props.sessionLength)}
          placeholder="Enter session length..."
          onChange={this.handleChange}
        />
      </p>
    )

    const taskInput = (
      <p>
        <input
          className="task-input"
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
        {this.props.mode === modes.ALARM ? sessionLengthInput : ""}
        {taskInput}
        <p>{this.props.alert ? (this.props.alert) : ""}</p>
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Task)