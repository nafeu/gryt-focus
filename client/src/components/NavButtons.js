import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  isActive: state.timer.isActive
})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export class NavButtons extends React.Component {
  render() {
    return (
      <div>
        <h3>NavButtons</h3>
        <hr/>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavButtons)