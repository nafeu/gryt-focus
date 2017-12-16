import React from 'react'
import Timer from '../modules/timer/components/Timer'
import Task from '../modules/task/components/Task'
import Interaction from '../components/Interaction'

class Home extends React.Component {
  render () {
    return (
      <div>
        <Interaction />
        <Task />
        <Timer />
      </div>
    )
  }
}

export default Home
