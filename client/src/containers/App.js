import React from 'react';
import { Route, Link } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Analysis from './Analysis'

const App = () => (
  <div>
    <header>
      <Link to="/">Home</Link>
      <Link to="/about-us">About</Link>
      <Link to="/analysis">Analysis</Link>
    </header>

    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/about-us" component={About} />
      <Route exact path="/analysis" component={Analysis} />
    </main>
  </div>
)

export default App