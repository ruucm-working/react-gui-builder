/**
 *
 * HomePage
 *
 */

import React, { Component } from "react";

class HomePage extends Component {
  // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1em"
          }}
        >
          <div>
            <h3 style={{ padding: "1em", textAlign: "center" }}>
              <span>11</span>
            </h3>
          </div>
        </div>

      </div>
    ); // eslint-disable-line
  }
}

export default HomePage;
