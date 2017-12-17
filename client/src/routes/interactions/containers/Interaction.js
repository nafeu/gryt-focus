import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as focusSessions from '../../../modules/focus-sessions'
import Interaction from '../components/Interaction'

class InteractionContainer extends Component {
  render () {
    return (
      <Interaction state={this.props.state} actions={this.props.actions}/>
    )
  }
}

const mapStateToProps = state => ({ state: state.focusSessions })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(focusSessions.actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(InteractionContainer)
