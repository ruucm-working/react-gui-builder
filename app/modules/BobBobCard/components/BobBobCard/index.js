/**
 *
 * BobBobCard
 *
 */

import React, { Component } from 'react'

// import { BobBobCard } from 'modules/BobBobCard'

class BobBobCard extends Component {
  render() {
    return <div {...this.props}>{this.props.children}</div>
  }
}

export default BobBobCard
