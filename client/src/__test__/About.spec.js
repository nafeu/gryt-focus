import React from 'react';
import ReactDOM from 'react-dom';
import About from '../containers/About';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<About />, div);
});