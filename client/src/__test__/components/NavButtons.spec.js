import React from 'react'
import ConnectedNavButtons, { NavButtons } from '../../components/NavButtons'
import { shallow, mount} from 'enzyme'
import configureStore from 'redux-mock-store'
import renderer from 'react-test-renderer'

const initialState = {
  navButtons: {}
}

const props = {}

function setupNavButtons(inputProps) {
  if (inputProps) {
    return mount(<NavButtons {...inputProps} />)
  }
  return mount(<NavButtons {...props} />)
}

function setupConnectedNavButtons() {
  const mockStore = configureStore()
  return shallow(<ConnectedNavButtons store={mockStore(initialState)} />)
}

// describe('Connected NavButtons component', () => {
//   let component

//   beforeEach(()=>{
//     component = setupConnectedNavButtons()
//   })

//   it('renders the connected(NavButtons) component without crashing', () => {
//      expect(component.length).toEqual(1)
//   })

//   it('matches its props with the initialState', () => {
//      expect(component.prop('NavButtons.isActive')).toEqual(initialState.isActive)
//   })
// });

describe('NavButtons component', () => {
  let component

  beforeEach(()=>{
    component = setupNavButtons()
  })

  it('renders the NavButtons component without crashing', () => {
    expect(component.length).toEqual(1)
  })

  it('instantiates with correct internal state', () => {
    expect(component.instance().state).toEqual(null)
  })
});