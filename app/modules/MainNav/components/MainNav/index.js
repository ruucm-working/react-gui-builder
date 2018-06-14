/**
 *
 * MainNav
 *
 */

import React, { Component } from 'react'

class MainNav extends Component {
  render() {
    return <div {...this.props}>{this.props.children}</div>
  }
}

export default MainNav
