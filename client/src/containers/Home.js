import React from 'react'
import Timer from '../modules/timer/components/Timer'
import Task from '../modules/task/components/Task'
import Efficiency from '../modules/efficiency/components/Efficiency'
import Interaction from '../components/Interaction'

class Home extends React.Component {
  render () {
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
