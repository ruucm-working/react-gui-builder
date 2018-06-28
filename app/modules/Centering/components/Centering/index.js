/**
 *
 * Centering
 *
 */

import React, { Component } from 'react'
import styled, { css } from 'styled-components'

const CenteringWrapper = styled.div`
  ${props =>
    props.center == 'x' &&
    css`
      left: 50%;
      right: auto;
      transform: translateX(-50%);
    `};
  ${props =>
    props.center == 'y' &&
    css`
      top: 50%;
      bottom: auto;
      transform: translateY(-50%);
    `};
  ${props =>
    props.center == 'xy' &&
    css`
      left: 50%;
      top: 50%;
      bottom: auto;
      right: auto;
      transform: translateX(-50%) translateY(-50%);
    `};
`

class Centering extends Component {
  render() {
    return (
      <CenteringWrapper {...this.props}>{this.props.children}</CenteringWrapper>
    )
  }
}

export default Centering
