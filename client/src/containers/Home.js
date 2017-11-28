import React from 'react'
import Timer from '../components/Timer'
import Task from '../components/Task'
import Efficiency from '../components/Efficiency'
import Interaction from '../components/Interaction'

class Home extends React.Component {
  render() {
    return (
      <div>
        <Interaction />
        <Task />
        <Timer />
        <Efficiency />
      </div>
    )
  }
}

export default Home