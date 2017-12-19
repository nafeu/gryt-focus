import React from 'react'
import { shallow } from 'enzyme'

import * as focusSessions from '../../../modules/focus-sessions'
import Interaction from './Interaction'

describe('Interaction Component', () => {
  let Component

  it('renders', () => {
    const props = mergedIntoDefaults({})

    Component = shallow(
      <Interaction {...props} />
    )

    expect(Component.length).toBeTruthy()
  })

  it('has the start button if focus session is not active', () => {
    const startSessionAction = jest.fn()
    const props = mergedIntoDefaults({
      isFocusSessionActive: false,
      startSession: startSessionAction
    })

    Component = shallow(
      <Interaction {...props} />
    )

    expect(Component.find('#start-end-button').text()).toEqual('Start')

    Component.find('#start-end-button').simulate('click')

    expect(startSessionAction).toHaveBeenCalled()
  })
})

function mergedIntoDefaults (props) {
  const defaultProps = {
    isFocusSessionActive: false,
    timerMode: focusSessions.constants.ALARM,
    alarm: false,
    startSession: jest.fn(),
    pauseSession: jest.fn(),
    resumeSession: jest.fn(),
    endSession: jest.fn(),
    clearSession: jest.fn(),
    deactivateAlarm: jest.fn(),
    toggleTimerMode: jest.fn()
  }
  return {
    ...defaultProps,
    ...props
  }
}
