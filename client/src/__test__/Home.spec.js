import React from 'react';
import ReactDOM from 'react-dom';
import Home from '../containers/Home';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Home component',()=>{
  let wrapper

  beforeEach(()=>{
    wrapper = shallow(<Home />)
  })

  it('renders without crashing', () => {
    expect(wrapper.length).toEqual(1)
  });
});
