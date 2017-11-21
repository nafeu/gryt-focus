import React from 'react'
import ConnectedTimer, { Timer } from '../../components/Timer'
import { shallow, mount} from 'enzyme'
import configureStore from 'redux-mock-store'
import renderer from 'react-test-renderer'

const initialState = {
  timer: {
    startTime: null,
    endTime: null,
    isActive: false
  }
}

const props = {
  isActive: false,
  startTime: null,
  toggleTimer: jest.fn()
}

function setupTimer(inputProps) {
  if (inputProps) {
    return mount(<Timer {...inputProps} />)
  }
  return mount(<Timer {...props} />)
}

function setupConnectedTimer() {
  const mockStore = configureStore()
  return shallow(<ConnectedTimer store={mockStore(initialState)} />)
}

describe('Connected Timer component', () => {
  let component

  beforeEach(()=>{
    component = setupConnectedTimer()
  })

  it('renders the connected(Timer) component without crashing', () => {
     expect(component.length).toEqual(1)
  })

  it('matches its props with the initialState', () => {
     expect(component.prop('timer.isActive')).toEqual(initialState.isActive)
     expect(component.prop('timer.startTime')).toEqual(initialState.startTime)
     expect(component.prop('timer.endTime')).toEqual(initialState.endTime)
  })
});

describe('Timer component', () => {
  let component

  beforeEach(()=>{
    component = setupTimer()
  })

  it('renders the Timer component without crashing', () => {
    expect(component.length).toEqual(1)
  })

  it('instantiates with correct internal state', () => {
    expect(component.instance().state).toEqual({
      "active": false,
      "elapsedTime": 0,
      "timerInterval": null
    })
  })

  it('can initiate a timer interval', () => {
    component.instance().initTimerInterval()
    expect(component.instance().state.active).toBeTruthy()
    expect(component.instance().state.timerInterval).toBeTruthy()
  })

  it('updates on tick', () => {
    component.instance().tick()
    expect(component.instance().state.elapsedTime).toBeGreaterThanOrEqual(1000)
  })

  it('can clear the timer interval', () => {
    component.instance().clearTimerInterval()
    expect(component.instance().state.timerInterval).toBeNull()
  })

  it('can toggle the timer', () => {
    expect(props.toggleTimer.mock.calls.length).toBe(0)
    component.instance().toggleTimer()
    expect(props.toggleTimer.mock.calls.length).toBe(1)
    expect(component.instance().state.active).toBeTruthy()
    component.instance().toggleTimer()
    expect(props.toggleTimer.mock.calls.length).toBe(2)
    expect(component.instance().state.active).toBeFalsy()
  })

  it('did mount correctly', () => {
    component.instance().componentDidMount()
    expect(component.instance().state.timerInterval).toBeNull()
  })

  it('will unmount correctly', () => {
    component = setupTimer({
      isActive: true,
      startTime: null,
      toggleTimer: jest.fn()
    })
    expect(component.instance().state.timerInterval).toBeTruthy()
    component.instance().componentWillUnmount()
    expect(component.instance().state.timerInterval).toBeNull()
  })

  it('stores elapsed time on active timers', () => {
    component = setupTimer({
      isActive: true,
      startTime: 762152400,
      toggleTimer: jest.fn()
    })
    expect(component.instance().state.elapsedTime).toBeGreaterThan(0)
  })
});