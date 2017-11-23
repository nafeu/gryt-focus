import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  interruptions: state.efficiency.interruptions
})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export class Efficiency extends React.Component {
  render() {
    return (
      <div>
        <h3>Efficiency</h3>
        <p>Interruptions: {this.props.interruptions}</p>
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Efficiency)