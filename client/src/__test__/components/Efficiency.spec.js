import React from 'react'
import ConnectedEfficiency, { Efficiency } from '../../components/Efficiency'
import { shallow, mount} from 'enzyme'
import configureStore from 'redux-mock-store'
import renderer from 'react-test-renderer'

const initialState = {
  efficiency: {},
  timer: {
    startTime: null,
    endTime: null,
    isActive: false
  }
}

const props = {
  interruptions: 0,
  startTime: null,
  endTime: null,
  accumulatedTime: 0,
  isActive: false
}

function setupComponent(inputProps) {
  if (inputProps) {
    return mount(<Efficiency {...inputProps} />)
  }
  return mount(<Efficiency {...props} />)
}

function setupConnectedComponent() {
  const mockStore = configureStore()
  return shallow(<ConnectedEfficiency store={mockStore(initialState)} />)
}

describe('Connected Efficiency component', () => {
  let component

  beforeEach(()=>{
    component = setupConnectedComponent()
  })

  it('renders the connected(Efficiency) component without crashing', () => {
     expect(component.length).toEqual(1)
  })

  it('matches its props with the initialState', () => {
     expect(component.prop('Efficiency.isActive')).toEqual(initialState.isActive)
  })
});

describe('Efficiency component', () => {
  let component

  beforeEach(()=>{
    component = setupComponent()
  })

  it('renders the Efficiency component without crashing', () => {
    expect(component.length).toEqual(1)
  })

  it('instantiates with correct internal state', () => {
    expect(component.instance().state).toEqual({
      focus: "---",
      timerInterval: null
    })
  })

  it('can initiate a timer interval', () => {
    component.instance().initTimerInterval()
    expect(component.instance().state.timerInterval).toBeTruthy()
  })

  it('updates on tick', () => {
    component.instance().tick()
    expect(component.instance().state.focus).toBeTruthy()
  })

  it('can clear the timer interval', () => {
    component.instance().clearTimerInterval()
    expect(component.instance().state.timerInterval).toBeNull()
  })

  it('did mount correctly', () => {
    component.instance().componentDidMount()
    expect(component.instance().state.timerInterval).toBeNull()
  })

  it('will unmount correctly', () => {
    component = setupComponent({
      isActive: true,
      startTime: null,
      toggleTimer: jest.fn()
    })
    expect(component.instance().state.timerInterval).toBeTruthy()
    component.instance().componentWillUnmount()
    expect(component.instance().state.timerInterval).toBeNull()
  })

  it('creates appropriate timer on prop change', () => {
    expect(component.instance().state.timerInterval).toBeNull()
    component.instance().componentWillReceiveProps({
      isActive: true,
      startTime: 762152400,
      endTime: null,
      accumulatedTime: 0,
      interruptions: 0
    })
    expect(component.instance().state.timerInterval).toBeTruthy()
  })

  it('clears appropriate timer on prop change', () => {
    component = setupComponent({
      isActive: true,
      startTime: 762152400,
      endTime: null,
      accumulatedTime: 0,
      interruptions: 0
    })
    expect(component.instance().state.timerInterval).toBeTruthy()
    component.instance().componentWillReceiveProps({
      isActive: false,
      startTime: 762152400,
      endTime: 762153400,
      accumulatedTime: 1000,
      interruptions: 0
    })
    expect(component.instance().state.timerInterval).toBeNull()
    expect(component.instance().state.focus).toBeTruthy()
  })

  it('gets correct elapsed time when start time and end time given', () => {
    component = setupComponent({
      isActive: false,
      startTime: 762152400,
      endTime: 762153400,
      accumulatedTime: 1000,
      interruptions: 0
    })
    expect(component.instance().getElapsedTime()).toEqual(1000)
  })
});