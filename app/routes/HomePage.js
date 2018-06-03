/**
 *
 * HomePage
 *
 */

import React, { Component } from 'react'

import { Link } from 'react-router'

class HomePage extends Component {
  // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1em',
          }}
        >
          <div>
            <h3 style={{ padding: '1em', textAlign: 'center' }}>
              <span>home</span>
            </h3>
          </div>
          <div>
            <Link to={'new-page'}>new page</Link>
          </div>
        </div>
      </div>
    ) // eslint-disable-line
  }
}

export default HomePage
