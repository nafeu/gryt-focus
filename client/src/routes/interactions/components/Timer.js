import React from 'react'

import { getDisplayTime } from '../../../helpers'

function Timer (props) {
  const {
    isActive,
    elapsedTime
  } = props

  return (
    <div>
      <h3>{isActive ? 'Active' : 'Inactive'}</h3>
      <p>Elapsed: {getDisplayTime(elapsedTime)}</p>
      <hr/>
    </div>
  )
}

export default Timer
