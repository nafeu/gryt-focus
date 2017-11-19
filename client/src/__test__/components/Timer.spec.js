import React from 'react'
import ConnectedTimer, { Timer } from '../../components/Timer'
import { shallow } from 'enzyme'
import configureStore from 'redux-mock-store'

const initialState = {
  timer: {
    startTime: null,
    endTime: null,
    isActive: false
  }
}

describe('Connected Timer component', () => {

  const mockStore = configureStore()
  let store, container

  beforeEach(()=>{
    store = mockStore(initialState)
    container = shallow(<ConnectedTimer store={store} /> )
  })

  it('renders the connected(Timer) component without crashing', () => {
     expect(container.length).toEqual(1)
  });

  it('matches its props with the initialState', () => {
     expect(container.prop('timer.isActive')).toEqual(initialState.isActive)
  });
});

describe('Timer component', () => {
  const initialState = {

  }
})