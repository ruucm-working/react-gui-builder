/**
 *
 * Hover
 *
 */

import React, { Component } from 'react'
import styled, { css } from 'styled-components'

const HoverWrapper = styled.span`
  ${props =>
    props.color &&
    css`
      &:hover {
        color: ${props.color} !important;
      }
    `};
  ${props =>
    props.transition &&
    props.transition.target &&
    props.transition.time &&
    css`
      -webkit-transition: ${props.transition.target}
        ${props.transition.time + 'ms'}; /* Safari */
      transition: ${props.transition.target} ${props.transition.time + 'ms'};
    `};
`
class Hover extends Component {
  render() {
    return <HoverWrapper {...this.props}>{this.props.children}</HoverWrapper>
  }
}

export default Hover
