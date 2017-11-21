import React from 'react';
import App from '../../containers/App';
import { shallow } from 'enzyme';

describe('App component',()=>{
  let wrapper

  beforeEach(()=>{
    wrapper = shallow(<App />)
  })

  it('renders without crashing', () => {
    expect(wrapper.length).toEqual(1)
  });
});