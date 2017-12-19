import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'

import { storeFake } from '../../../spec/support'
import InteractionContainer from './Interaction'
import Interaction from '../components/Interaction'
import * as focusSessions from '../../../modules/focus-sessions'

describe('Interaction Container', () => {
  const store = storeFake({
    focusSessions: {
      isActive: false,
      timerMode: focusSessions.constants.ALARM,
      alarm: false
    }
  })

  let Container
  let Component

  it('should render', () => {
    const wrapper = mount(
      <Provider store={store}>
        <InteractionContainer/>
      </Provider>
    )

    Container = wrapper.find(InteractionContainer)
    Component = Container.find(Interaction)

    expect(Container.length).toBeTruthy()
    expect(Component.length).toBeTruthy()
  })
})
