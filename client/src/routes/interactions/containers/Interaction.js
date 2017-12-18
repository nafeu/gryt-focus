import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as focusSessions from '../../../modules/focus-sessions'
import Interaction from '../components/Interaction'

function mapStateToProps (state) {
  return {
    isFocusSessionActive: state.focusSessions.isActive,
    timerMode: state.focusSessions.timerMode,
    alarm: state.focusSessions.alarm
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    startSession: focusSessions.actions.startSession,
    pauseSession: focusSessions.actions.pauseSession,
    resumeSession: focusSessions.actions.resumeSession,
    endSession: focusSessions.actions.endSession,
    clearSession: focusSessions.actions.clearSession,
    toggleTimerMode: focusSessions.actions.toggleTimerMode,
    deactivateAlarm: focusSessions.actions.deactivateAlarm
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Interaction)
