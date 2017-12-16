import React from 'react'
import ConnectedTask, { Task } from '../../app/task/Task'
import { shallow, mount } from 'enzyme'
import configureStore from 'redux-mock-store'
import renderer from 'react-test-renderer'

const initialState = {
  task: {
    name: ""
  },
  timer: {
    isActive: false
  }
}

const props = {
  name: "",
  isActive: false,
  sessionLength: 60000,
  setTask: jest.fn(),
  startTimer: jest.fn(),
  stopTimer: jest.fn(),
  setSessionLength: jest.fn()
}

function setupComponent(inputProps) {
  if (inputProps) {
    return mount(<Task {...inputProps} />)
  }
  return mount(<Task {...props} />)
}

function setupConnectedComponent() {
  const mockStore = configureStore()
  return shallow(<ConnectedTask store={mockStore(initialState)} />)
}

describe('Connected Task component', () => {
  let component

  beforeEach(()=>{
    component = setupConnectedComponent()
  })

  it('renders the connected(Task) component without crashing', () => {
     expect(component.length).toEqual(1)
  })

  it('matches its props with the initialState', () => {
   expect(component.prop('name')).toEqual(initialState.task.name)
   expect(component.prop('isActive')).toEqual(initialState.timer.isActive)
  })
});

describe('Task component', () => {
  let component

  beforeEach(()=>{
    component = setupComponent()
  })

  it('renders the Task component without crashing', () => {
    expect(component.length).toEqual(1)
  })

  it('instantiates with correct internal state', () => {
    expect(component.instance().state).toEqual(null)
  })

  it('handles input keypresses accordingly', () => {
    component.find('.task-input').simulate('keypress', {key: 'a'})
    component = setupComponent({
      ...props,
      isActive: true,
    })
    component.find('.task-input').simulate('keypress', {key: 'Enter'})
    expect(props.startTimer.mock.calls.length).toBe(1)
  })

  it('handles input changes accordingly', () => {
    const event = {target: {value: 'asdf'}};
    component.find('.task-input').simulate('change', event)
    expect(props.stopTimer.mock.calls.length).toBe(0)
  })

  it('calls startTimer on input field enter press', () => {
    const event = {key: 'Enter'};
    component.find('.task-input').simulate('keypress', event)
  })

  it('calls stopTimer on task-input field change', () => {
    component = setupComponent({
      ...props,
      isActive: true,
    })
    const taskEvent = {target: {className: 'task-input', value: 'asdf'}};
    component.find('.task-input').simulate('change', taskEvent)
    expect(props.stopTimer.mock.calls.length).toBe(1)
  })

  it('calls stopTimer and setSessionLength on session-length-input field change', () => {
    component = setupComponent({
      ...props,
      mode: 1,
      isActive: true
    })
    const sessionLengthEvent = {target: {className: "session-length-input", value: '1'}};
    component.find('.session-length-input').simulate('change', sessionLengthEvent)
    expect(props.stopTimer.mock.calls.length).toBe(2)
    expect(props.setSessionLength.mock.calls.length).toBe(1)
  })

  it('sets a new task on input field blur', () => {
    component.find('.task-input').simulate('focus')
    component.find('.task-input').simulate('blur')
    expect(props.setTask.mock.calls.length).toBe(1)
  })

  it('displays an alert', () => {
    component = setupComponent({
      ...props,
      alert: "alert message"
    })
    expect(component.find('.alert-message').exists()).toBeTruthy()
  })
});
