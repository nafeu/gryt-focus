import React from 'react'
import ConnectedInteraction, { Interaction } from '../../routes/interactions/components/Interaction'
import { shallow, mount} from 'enzyme'
import configureStore from 'redux-mock-store'
import renderer from 'react-test-renderer'

const initialState = {
  interaction: {},
  timer: {
    isActive: false
  },
  task: {
    name: null
  }
}

const props = {
  isActive: false,
  toggleTimer: jest.fn(),
  resetTimer: jest.fn(),
  incrementInterruptions: jest.fn()
}

function setupComponent(inputProps) {
  if (inputProps) {
    return mount(<Interaction {...inputProps} />)
  }
  return mount(<Interaction {...props} />)
}

function setupConnectedComponent() {
  const mockStore = configureStore()
  return shallow(<ConnectedInteraction store={mockStore(initialState)} />)
}

describe('Connected Interaction component', () => {
  let component

  beforeEach(()=>{
    component = setupConnectedComponent()
  })

  it('renders the connected(Interaction) component without crashing', () => {
     expect(component.length).toEqual(1)
  })

  it('matches its props with the initialState', () => {
     expect(component.prop('isActive')).toEqual(initialState.timer.isActive)
  })
});

describe('Interaction component', () => {
  let component

  beforeEach(()=>{
    component = setupComponent()
  })

  it('renders the Interaction component without crashing', () => {
    expect(component.length).toEqual(1)
  })

  it('instantiates with correct internal state', () => {
    expect(component.instance().state).toEqual(null)
  })

  it('renders start and stop correctly based on timer status', () => {
    expect(component.find('.toggle-button').text()).toEqual('Start')
    component = setupComponent({
      ...props,
      isActive: true
    })
    expect(component.find('.toggle-button').text()).toEqual('Stop')
  })

  it('toggles the timer status when start/stop button is clicked', () => {
    component.find('.toggle-button').simulate('click')
    expect(props.toggleTimer.mock.calls.length).toBe(1)
  })

  it('renders the alarm button accordingly', () => {
    component = setupComponent({
      ...props,
      alarm: true
    })
    expect(component.find('.alarm-button').exists()).toBeTruthy()
  })

});
