/**
 *
 * Page79
 *
 */

import React, { Component } from "react";

import { Link } from "modules/Router";

class Page79 extends Component {
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
          <Link to="example-01"><span>example-01</span></Link>
          <Link to="example-02"><span>example-02</span></Link>
        </div>

      </div>
    ); // eslint-disable-line
  }
}

export default Page79;
