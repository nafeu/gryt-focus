import React from 'react'
import Interaction from '../../interactions/containers/Interaction'
import Timer from '../../interactions/containers/Timer'
import Task from '../../task-tracking/components/Task'

const Home = () => (
  <div>
    <Interaction/>
    <Timer/>
    <Task/>
  </div>
)

export default Home
