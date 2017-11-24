import React from 'react'
import ConnectedNavButtons, { NavButtons } from '../../components/NavButtons'
import { shallow, mount} from 'enzyme'
import configureStore from 'redux-mock-store'
import renderer from 'react-test-renderer'

const initialState = {
  navButtons: {},
  timer: {
    isActive: false
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
    return mount(<NavButtons {...inputProps} />)
  }
  return mount(<NavButtons {...props} />)
}

function setupConnectedComponent() {
  const mockStore = configureStore()
  return shallow(<ConnectedNavButtons store={mockStore(initialState)} />)
}

describe('Connected NavButtons component', () => {
  let component

  beforeEach(()=>{
    component = setupConnectedComponent()
  })

  it('renders the connected(NavButtons) component without crashing', () => {
     expect(component.length).toEqual(1)
  })

  it('matches its props with the initialState', () => {
     expect(component.prop('isActive')).toEqual(initialState.timer.isActive)
  })
});

describe('NavButtons component', () => {
  let component

  beforeEach(()=>{
    component = setupComponent()
  })

  it('renders the NavButtons component without crashing', () => {
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
});