import React from 'react';
import Home from '../../routes/home/containers/Home';
import { shallow } from 'enzyme';

describe('Home component',()=>{
  let wrapper

  beforeEach(()=>{
    wrapper = shallow(<Home />)
  })

  it('renders without crashing', () => {
    expect(wrapper.length).toEqual(1)
  });
});
