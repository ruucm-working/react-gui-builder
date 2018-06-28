/**
 *
 * Page77
 *
 */

import React, { Component } from "react";

import { Row, Column } from "modules/Layout";

class Page77 extends Component {
  // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div>

        <div
          style={{
            backgroundColor: "#1434f7",
            paddingTop: "24px",
            paddingBottom: "24px"
          }}
        >
          <Row
            style={{
              backgroundColor: "#e78080",
              marginLeft: "24px",
              marginRight: "24px"
            }}
          >
            <Column col={6} mCol={12}><span>Text</span></Column>
            <Column col={6} mCol={12}>
              <img
                src="https://66.media.tumblr.com/35752a031db1718c5172295a5ed345cc/tumblr_p52m2zHoRG1wun3pho1_r6_640.gif"
                style={{ width: "100%", objectFit: "contain", height: "100%" }}
              />
            </Column>
          </Row>
        </div>

      </div>
    ); // eslint-disable-line
  }
}

export default Page77;
