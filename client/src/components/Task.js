import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  isActive: state.timer.isActive
})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export class Task extends React.Component {
  render() {
    return (
      <div>
        <h3>Task</h3>
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Task)