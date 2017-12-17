import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as focusSessions from '../../../modules/focus-sessions'
import Interaction from '../components/Interaction'

function mapStateToProps (state) {
  return {
    isActive: state.focusSessions.isActive,
    mode: state.focusSessions.mode,
    alarm: state.focusSessions.alarm
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    startSession: focusSessions.actions.startSession,
    endSession: focusSessions.actions.endSession,
    clearSession: focusSessions.actions.clearSession,
    deactivateAlarm: focusSessions.actions.deactivateAlarm
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Interaction)
