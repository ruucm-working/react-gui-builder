/**
 *
 * Title
 *
 */

import React, { Component } from 'react'

class Title extends Component {
  render() {
    return <h1 style={this.props.style}>{this.props.children}</h1>
  }
}

export default Title
