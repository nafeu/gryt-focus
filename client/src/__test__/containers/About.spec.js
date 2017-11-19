import React from 'react'
import renderer from 'react-test-renderer'
import About from '../../containers/About'

describe("About component", () => {
  it('renders correctly without crashing', () => {
    const tree = renderer.create(
      <About />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
})