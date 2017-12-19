import React from 'react'
import { shallow } from 'enzyme'

import * as focusSessions from '../../../modules/focus-sessions'
import Interaction from './Interaction'

describe('Interaction Component', () => {
  const InteractionText = 'Interaction 1'
  const saveSelection = jest.fn()
  let Component

  it('should render', () => {
    const props = {
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

    Component = shallow(
      <Interaction
        {...props}
      />
    )
    expect(Component.length).toBeTruthy()

    // expect(Component.find('label').text()).toBe(InteractionText)
  })

  // it('should call saveSelection when clicked', () => {
  //   Component = shallow(
  //     <Interaction
  //
  //     />
  //   )
  //   Component.find('input').simulate('click')
  //
  //   expect(saveSelection).toHaveBeenCalled()
  // })
})
