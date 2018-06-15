/**
 *
 * Page70
 *
 */

import React, { Component } from "react";

import { MainNav, Logo, LogoImage, LogoText } from "modules/MainNav";

class Page70 extends Component {
  // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div>

        <MainNav>
          <Logo style={{ backgroundColor: "#525ef6" }}>
            <LogoImage style={{ fontSize: "60px" }} />
            <LogoText style={{ fontSize: "50px" }}>
              <span>하버 매거진</span>
            </LogoText>
          </Logo>
        </MainNav>

      </div>
    ); // eslint-disable-line
  }
}

export default Page70;
