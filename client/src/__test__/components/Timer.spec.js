import React from 'react'
import ConnectedTimer, { Timer } from '../../app/timer/Timer'
import { shallow, mount} from 'enzyme'
import configureStore from 'redux-mock-store'
import renderer from 'react-test-renderer'
import moment from 'moment'

const initialState = {
  timer: {
    startTime: null,
    endTime: null,
    isActive: false,
    sessionLength: 60000,
    mode: 1
  }
}

const props = {
  isActive: false,
  startTime: null,
  accumulatedTime: 0,
  toggleTimer: jest.fn(),
  stopTimer: jest.fn(),
  activateAlarm: jest.fn()
}

function setupComponent(inputProps) {
  if (inputProps) {
    return mount(<Timer {...inputProps} />)
  }
  return mount(<Timer {...props} />)
}

function setupConnectedComponent() {
  const mockStore = configureStore()
  return shallow(<ConnectedTimer store={mockStore(initialState)} />)
}

describe('Connected Timer component', () => {
  let component

  beforeEach(()=>{
    component = setupConnectedComponent()
  })

  it('renders the connected(Timer) component without crashing', () => {
     expect(component.length).toEqual(1)
  })

  it('matches its props with the initialState', () => {
     expect(component.prop('isActive')).toEqual(initialState.timer.isActive)
     expect(component.prop('startTime')).toEqual(initialState.timer.startTime)
     expect(component.prop('endTime')).toEqual(initialState.timer.endTime)
  })
});

describe('Timer component', () => {
  let component

  beforeEach(()=>{
    component = setupComponent()
  })

  it('renders the Timer component without crashing', () => {
    expect(component.length).toEqual(1)
  })

  it('instantiates with correct internal state', () => {
    expect(component.instance().state).toEqual({
      elapsedTime: 0,
      timerInterval: null
    })
  })

  it('can initiate a timer interval', () => {
    component.instance().initTimerInterval()
    expect(component.instance().state.timerInterval).toBeTruthy()
  })

  it('updates on tick', () => {
    component.instance().tick()
    expect(component.instance().state.elapsedTime).toBeGreaterThanOrEqual(1000)
  })

  it('activates the alarm when the session is done', () => {
    const sessionEndProps = {
      accumulatedTime: 60000,
      sessionLength: 60000,
      startTime: (moment.now() - 60000),
      mode: 1,
      stopTimer: jest.fn(),
      activateAlarm: jest.fn()
    }
    component = setupComponent(sessionEndProps)
    component.instance().tick()
    expect(component.instance().state.elapsedTime).toBeGreaterThanOrEqual(60000)
    expect(sessionEndProps.stopTimer.mock.calls.length).toBe(1)
    expect(sessionEndProps.activateAlarm.mock.calls.length).toBe(1)
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

  it('stores elapsed time on active timers', () => {
    component = setupComponent({
      isActive: true,
      startTime: 762152400,
      accumulatedTime: 0,
      toggleTimer: jest.fn()
    })
    expect(component.instance().state.elapsedTime).toBeGreaterThan(0)
  })

  it('creates appropriate timer on prop change', () => {
    expect(component.instance().state.timerInterval).toBeNull()
    component.instance().componentWillReceiveProps({
      isActive: true,
      startTime: 762152400,
      endTime: null,
      accumulatedTime: 0
    })
    expect(component.instance().state.timerInterval).toBeTruthy()
  })

  it('clears appropriate timer on prop change', () => {
    component = setupComponent({
      isActive: true,
      startTime: 762152400,
      endTime: null,
      accumulatedTime: 0
    })
    expect(component.instance().state.timerInterval).toBeTruthy()
    component.instance().componentWillReceiveProps({
      isActive: false,
      startTime: 762152400,
      endTime: 762153400,
      accumulatedTime: 1000
    })
    expect(component.instance().state.timerInterval).toBeNull()
    expect(component.instance().state.elapsedTime).toEqual(1000)
    component.instance().componentWillReceiveProps({
      isActive: false,
      startTime: 762152400,
      endTime: 762153400,
      accumulatedTime: 1000
    })
    expect(component.instance().state.elapsedTime).toEqual(1000)
  })

  it('will not mess with timers if prop changes and isActive is the same', () => {
    component.instance().componentWillReceiveProps({...props})
    expect(component.instance().state.timerInterval).toEqual(null)
  })
});
