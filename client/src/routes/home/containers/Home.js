import React from 'react'
import Interaction from '../../interactions/components/Interaction'
import Timer from '../../interactions/components/Timer'
import Task from '../../task-tracking/components/Task'

const Home = () => (
  <div>
    <Interaction/>
    <Timer/>
    <Task/>
  </div>
)

export default Home
