/**
 *
 * Header
 *
 */

import React, { Component } from 'react'

class Header extends Component {
  render() {
    return <div style={{ ...this.props.style }}>{this.props.children}</div>
  }
}

export default Header
