import React from 'react'
import ConnectedTask, { Task } from '../../components/Task'
import { shallow, mount} from 'enzyme'
import configureStore from 'redux-mock-store'
import renderer from 'react-test-renderer'

const initialState = {
  task: {}
}

const props = {}

function setupTask(inputProps) {
  if (inputProps) {
    return mount(<Task {...inputProps} />)
  }
  return mount(<Task {...props} />)
}

function setupConnectedTask() {
  const mockStore = configureStore()
  return shallow(<ConnectedTask store={mockStore(initialState)} />)
}

// describe('Connected Task component', () => {
//   let component

//   beforeEach(()=>{
//     component = setupConnectedTask()
//   })

//   it('renders the connected(Task) component without crashing', () => {
//      expect(component.length).toEqual(1)
//   })

//   it('matches its props with the initialState', () => {
//      expect(component.prop('Task.isActive')).toEqual(initialState.isActive)
//   })
// });

describe('Task component', () => {
  let component

  beforeEach(()=>{
    component = setupTask()
  })

  it('renders the Task component without crashing', () => {
    expect(component.length).toEqual(1)
  })

  it('instantiates with correct internal state', () => {
    expect(component.instance().state).toEqual(null)
  })
});