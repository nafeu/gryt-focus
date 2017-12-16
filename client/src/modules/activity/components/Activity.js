import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  log: state.activity.log
})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export class Activity extends React.Component {
  render () {
    const log = this.props.log.map((entry, index) => {
      return (
        <tr key={index}>
          <td>{entry.datetime}</td>
          <td>{entry.length}</td>
          <td>{entry.interruptions}</td>
          <td>{entry.focus}</td>
          <td>{entry.name}</td>
        </tr>
      )
    })

    return (
      <div>
        <h3>Activity</h3>
        <table>
          <tbody>
            <tr>
              <th>Date</th>
              <th>Length</th>
              <th>Interruptions</th>
              <th>Focus</th>
              <th>Task</th>
            </tr>
            {log}
          </tbody>
        </table>
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity)
