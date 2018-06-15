/**
 *
 * Logo
 *
 */

import React, { Component } from 'react'

class Logo extends Component {
  render() {
    return <div style={this.props.style}>{this.props.children}</div>
  }
}

export default Logo
