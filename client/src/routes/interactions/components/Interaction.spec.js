import React from 'react'
import { shallow } from 'enzyme'

import * as focusSessions from '../../../modules/focus-sessions'
import Interaction from './Interaction'

describe('Interaction Component', () => {
  let Component

  it('renders', () => {
    const props = mergedIntoDefaults({})

    Component = render(props)

    expect(Component.length).toBeTruthy()
  })

  it('has the start button if focus session is not active', () => {
    const startSessionAction = jest.fn()
    const props = mergedIntoDefaults({
      isFocusSessionActive: false,
      startSession: startSessionAction
    })

    Component = render(props)
    const startButton = Component.find('#start-end-button')
    startButton.simulate('click')

    expect(startButton.text()).toEqual('Start')
    expect(startSessionAction).toHaveBeenCalled()
  })

  it('has the end button if focus session is active', () => {
    const endSessionAction = jest.fn()
    const props = mergedIntoDefaults({
      isFocusSessionActive: true,
      endSession: endSessionAction
    })

    Component = render(props)
    const endButton = Component.find('#start-end-button')
    endButton.simulate('click')

    expect(endButton.text()).toEqual('End')
    expect(endSessionAction).toHaveBeenCalled()
  })

  it('has the pause button if focus session is not paused', () => {
    const pauseSessionAction = jest.fn()
    const props = mergedIntoDefaults({
      isFocusSessionPaused: false,
      pauseSession: pauseSessionAction
    })

    Component = render(props)
    const pauseButton = Component.find('#pause-resume-button')
    pauseButton.simulate('click')

    expect(pauseButton.text()).toEqual('Pause')
    expect(pauseSessionAction).toHaveBeenCalled()
  })

  it('has the resume button if focus session is paused', () => {
    const resumeSessionAction = jest.fn()
    const props = mergedIntoDefaults({
      isFocusSessionPaused: true,
      resumeSession: resumeSessionAction
    })

    Component = render(props)
    const resumeButton = Component.find('#pause-resume-button')
    resumeButton.simulate('click')

    expect(resumeButton.text()).toEqual('Resume')
    expect(resumeSessionAction).toHaveBeenCalled()
  })
})

function mergedIntoDefaults (props) {
  const defaultProps = {
    isFocusSessionActive: false,
    isFocusSessionPaused: false,
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

function render (props) {
  return shallow(
    <Interaction {...props} />
  )
}
