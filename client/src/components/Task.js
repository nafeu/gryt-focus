import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  setTask,
} from '../actions/TaskActions'

const mapStateToProps = state => ({
  name: state.task.name
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setTask,
}, dispatch)

export class Task extends React.Component {

  constructor(props) {
    super(props)

    this.handleBlur = this.handleBlur.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleBlur(e) {
    e.preventDefault()
    this.props.setTask(e.target.value)
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.target.blur()
    }
  }

  render() {
    return (
      <div>
        <h3>Task</h3>
        <input
          type="text"
          placeholder="Enter a task..."
          defaultValue={this.props.name}
          onBlur={this.handleBlur}
          onKeyPress={this.handleKeyPress}
        />
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Task)