import React from 'react'
import PropTypes from 'prop-types'

import { Button } from './styles'

function ToggleButton(props) {
  const { value, onClick, isActive } = props

  return (
    <Button
      isActive={isActive}
      key={value}
      type="button"
      onClick={() => onClick(value)}
    >
      {value}
    </Button>
  )
}

ToggleButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default ToggleButton
