/**
 *
 * Page86
 *
 */

import React, { Component } from "react";

import { MainNav, Logo, LogoImage, LogoText } from "modules/MainNav";

class Page86 extends Component {
  // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div>

        <MainNav>
          <Logo style={{ backgroundColor: "#525ef6", paddingLeft: "25px" }}>
            <LogoImage style={{ fontSize: "60px", verticalAlign: "middle" }} />
            <LogoText
              style={{
                fontSize: "50px",
                color: "#ffffff",
                fontFamily: "NanumSquare",
                fontWeight: 100,
                verticalAlign: "middle",
                lineHeight: "116px",
                marginLeft: "18px"
              }}
            >
              <span>하버 매거진</span>
            </LogoText>
          </Logo>
        </MainNav>

      </div>
    ); // eslint-disable-line
  }
}

export default Page86;
