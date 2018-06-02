/**
 *
 * Desc
 *
 */

import React, { Component } from 'react'

class Desc extends Component {
  render() {
    return <p {...this.props}>{this.props.children}</p>
  }
}

export default Desc
