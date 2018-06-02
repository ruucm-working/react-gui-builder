import React from 'react'
import styled from 'styled-components'

const Column = props => {
  let col = props.col ? 'col-sm-' + props.col : ''
  let mCol = props.mCol ? ' col-' + props.mCol : ''
  return (
    <div className={col + mCol} style={{ ...props.style }}>
      {props.children}
    </div>
  )
}

export default Column
