import React from 'react'
import PropTypes from 'prop-types'

import { getDisplayTime } from '../../../helpers'

const Timer = (props) => {
  const {
    isFocusSessionActive,
    focusSessionElapsedDuration
  } = props

  return (
    <div>
      <h3>Focus Session is {isFocusSessionActive ? 'Active' : 'Inactive'}</h3>
      <p>Elapsed: {getDisplayTime(focusSessionElapsedDuration)}</p>
      <hr/>
    </div>
  )
}

Timer.propTypes = {
  isFocusSessionActive: PropTypes.bool.isRequired,
  focusSessionElapsedDuration: PropTypes.number.isRequired
}

export default Timer
