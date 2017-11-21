import React from 'react'
import Timer from '../components/Timer'
import Task from '../components/Task'
import Efficiency from '../components/Efficiency'
import NavButtons from '../components/NavButtons'

class Home extends React.Component {
  render() {
    return (
      <div>
        <NavButtons />
        <Task />
        <Timer />
        <Efficiency />
      </div>
    )
  }
}

export default Home