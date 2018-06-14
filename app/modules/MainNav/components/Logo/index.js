/**
 *
 * Logo
 *
 */

import React, { Component } from 'react'
import styled from 'styled-components'

import HarborMagazineIcon from '../../../../libs/fonts/HarborMagazineIcon'

const LogoWrapper = styled.div`
  ${HarborMagazineIcon};
  background: #525ef6;
`

class Logo extends Component {
  render() {
    return (
      <LogoWrapper style={this.props.style}>
        <span className="magharbor magharbor-main-logo" />
        <span>하버 매거진</span>
      </LogoWrapper>
    )
  }
}

export default Logo
