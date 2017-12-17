import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getMinsByMs } from '../../../helpers'
import * as tasks from '../../../modules/tasks'
import * as focusSessions from '../../../modules/focus-sessions'

class Task extends React.Component {
  constructor (props) {
    super(props)

    this.handleBlur = this.handleBlur.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    this.taskInput.focus()
  }

  handleBlur (e) {
    e.preventDefault()
    this.props.setTask(e.target.value)
  }

  handleKeyPress (e) {
    if (e.target.className === 'task-input') {
      if (e.key === 'Enter') {
        e.target.blur()
        this.props.startTimer()
      }
    }
    if (e.target.className === 'session-length-input') {
      if (e.key === 'Enter') {
        this.taskInput.focus()
      }
    }
  }

  handleChange (e) {
    e.preventDefault()
    if (e.target.className === 'task-input') {
      this.props.stopTimer()
    }
    if (e.target.className === 'session-length-input') {
      this.props.stopTimer()
      this.props.setSessionLength(e.target.value)
    }
  }

  render () {
    const sessionLengthInput = (
      <p>
        <input
          className="session-length-input"
          ref={(input) => { this.sessionLengthInput = input }}
          type="number"
          min="1"
          defaultValue={getMinsByMs(this.props.sessionLength)}
          placeholder="Enter session length..."
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      </p>
    )

    const taskInput = (
      <p>
        <input
          className="task-input"
          ref={(input) => { this.taskInput = input }}
          type="text"
          placeholder="Enter a task..."
          defaultValue={this.props.name}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      </p>
    )

    const alertMessage = (
      <h2 className='alert-message'>{this.props.alert}</h2>
    )

    return (
      <div>
        <h3>Task</h3>
        {this.props.mode === focusSessions.constants.ALARM ? sessionLengthInput : ''}
        {taskInput}
        {this.props.alert ? alertMessage : ''}
        <hr/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  name: state.tasks.name,
  alert: state.tasks.alert,
  isActive: state.focusSessions.isActive,
  mode: state.focusSessions.mode,
  sessionLength: state.focusSessions.sessionLength
})

const mapDispatchToProps = dispatch => bindActionCreators({
  startTimer: focusSessions.actions.startTimer,
  stopTimer: focusSessions.actions.stopTimer,
  setSessionLength: focusSessions.actions.setSessionLength,
  setTask: tasks.actions.setTask,
  setAlert: tasks.actions.setAlert
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Task)
