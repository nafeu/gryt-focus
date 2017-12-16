import React from 'react'
import Timer from '../app/timer/Timer'
import Task from '../app/task/Task'
import Efficiency from '../app/efficiency/Efficiency'
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
