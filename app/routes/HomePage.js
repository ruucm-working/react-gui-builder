/**
 *
 * HomePage
 *
 */

import React, { Component } from "react";

import { Link } from "modules/Router";

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
              <span>home</span>
            </h3>
          </div>
          <Link to="bob-cards"><span>밥카드 페이지</span></Link>
          <Link><span>new page</span></Link>
        </div>

      </div>
    ); // eslint-disable-line
  }
}

export default HomePage;
