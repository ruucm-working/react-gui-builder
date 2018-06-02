import React from 'react'
import styled from 'styled-components'
import bootstrapGrid from '../../libs/bootstrap-grid'
import cssReset from '../../libs/css-reset'

const RowWrapper = styled.div`
  ${cssReset};
  ${bootstrapGrid};
`

const Row = props => {
  return (
    <RowWrapper>
      <div className="row" style={{ ...props.style }}>
        {props.children}
      </div>
    </RowWrapper>
  )
}

export default Row
