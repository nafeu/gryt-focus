import React from 'react'
import ConnectedTask, { Task } from '../../components/Task'
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
  setTask: jest.fn(),
  startTimer: jest.fn(),
  stopTimer: jest.fn()
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
    component.find('input').simulate('keypress', {key: 'a'})
    component = setupComponent({
      ...props,
      isActive: true,
    })
    component.find('input').simulate('keypress', {key: 'Enter'})
    expect(props.startTimer.mock.calls.length).toBe(1)
  })

  it('handles input changes accordingly', () => {
    const event = {target: {value: 'asdf'}};
    component.find('input').simulate('change', event)
    expect(props.stopTimer.mock.calls.length).toBe(0)
  })

  it('calls startTimer on input field enter press', () => {
    const event = {key: 'Enter'};
    component.find('input').simulate('keypress', event)
  })

  it('calls stopTimer on input field change', () => {
    component = setupComponent({
      ...props,
      isActive: true,
    })
    const event = {target: {className: "task-input", value: 'asdf'}};
    component.find('input').simulate('change', event)
    expect(props.stopTimer.mock.calls.length).toBe(1)
  })

  it('sets a new task on input field blur', () => {
    component.find('input').simulate('focus')
    component.find('input').simulate('blur')
    expect(props.setTask.mock.calls.length).toBe(1)
  })
});