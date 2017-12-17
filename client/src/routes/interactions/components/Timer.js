import React from 'react'

import { getDisplayTime } from '../../../helpers'

function Timer ({ state }) {
  const {
    isActive,
    elapsedTime
  } = state

  return (
    <div>
      <h3>{isActive ? 'Active' : 'Inactive'}</h3>
      <p>Elapsed: {getDisplayTime(elapsedTime)}</p>
      <hr/>
    </div>
  )
}

export default Timer
