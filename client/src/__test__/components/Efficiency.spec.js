import React from 'react'
import ConnectedEfficiency, { Efficiency } from '../../components/Efficiency'
import { shallow, mount} from 'enzyme'
import configureStore from 'redux-mock-store'
import renderer from 'react-test-renderer'

const initialState = {
  efficiency: {}
}

const props = {}

function setupEfficiency(inputProps) {
  if (inputProps) {
    return mount(<Efficiency {...inputProps} />)
  }
  return mount(<Efficiency {...props} />)
}

function setupConnectedEfficiency() {
  const mockStore = configureStore()
  return shallow(<ConnectedEfficiency store={mockStore(initialState)} />)
}

// describe('Connected Efficiency component', () => {
//   let component

//   beforeEach(()=>{
//     component = setupConnectedEfficiency()
//   })

//   it('renders the connected(Efficiency) component without crashing', () => {
//      expect(component.length).toEqual(1)
//   })

//   it('matches its props with the initialState', () => {
//      expect(component.prop('Efficiency.isActive')).toEqual(initialState.isActive)
//   })
// });

describe('Efficiency component', () => {
  let component

  beforeEach(()=>{
    component = setupEfficiency()
  })

  it('renders the Efficiency component without crashing', () => {
    expect(component.length).toEqual(1)
  })

  it('instantiates with correct internal state', () => {
    expect(component.instance().state).toEqual(null)
  })
});