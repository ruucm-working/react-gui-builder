/**
 *
 * Page43
 *
 */

import React, { Component } from "react";

import { Row, Column } from "modules/Layout";
import { BobBobCard, Header, Title, Image, Desc } from "modules/BobBobCard";

class Page43 extends Component {
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
              <span
                style={{
                  fontFamily: "Nanum Gothic",
                  fontSize: "14px",
                  color: "#ad8686"
                }}
              >
                This is Bob cards Page
              </span>
            </h3>
          </div>
        </div>

        <Row>
          <Column col={4}>
            <BobBobCard
              style={{
                height: "400px",
                borderRadius: "10px",
                boxShadow: "0px 10px 44px 0px rgba(90,123,224,0.39)",
                width: "100%"
              }}
            >
              <Header
                style={{
                  backgroundImage: "url(http://materialdesignblog.com/wp-content/uploads/2016/06/image3.jpg)",
                  height: "200px",
                  borderTopRightRadius: "10px",
                  borderTopLeftRadius: "10px"
                }}
              >
                <Title
                  style={{
                    fontFamily: "Nanum Gothic",
                    margin: "0px",
                    color: "#ffffff",
                    position: "absolute",
                    right: "20px",
                    bottom: "20px"
                  }}
                >
                  <span>Bob Ross</span>
                </Title>
              </Header>
              <Image
                src="https://pbs.twimg.com/profile_images/910885630363688961/tWxPL76s_400x400.jpg"
                style={{
                  width: "100px",
                  height: "100px",
                  marginTop: "-60px",
                  marginLeft: "30px",
                  borderRadius: "50px",
                  boxShadow: "0px 10px 44px 0px rgba(90,123,224,0.39)"
                }}
              />
              <Desc
                style={{
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  color: "#797979",
                  fontFamily: "Nanum Gothic",
                  fontSize: "13px"
                }}
              >
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vulputate lacinia turpis, lobortis dignissim ligula malesuada consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vulputate lacinia turpis, lobortis dignissim ligula malesuada consequat.
                </span>
              </Desc>
            </BobBobCard>
          </Column>
          <Column col={4}>
            <BobBobCard
              style={{
                height: "400px",
                borderRadius: "10px",
                boxShadow: "0px 10px 44px 0px rgba(90,123,224,0.39)",
                width: "100%"
              }}
            >
              <Header
                style={{
                  backgroundImage: "url(http://materialdesignblog.com/wp-content/uploads/2016/06/image3.jpg)",
                  height: "200px",
                  borderTopRightRadius: "10px",
                  borderTopLeftRadius: "10px"
                }}
              >
                <Title
                  style={{
                    fontFamily: "Nanum Gothic",
                    margin: "0px",
                    color: "#ffffff",
                    position: "absolute",
                    right: "20px",
                    bottom: "20px"
                  }}
                >
                  <span>Bob Ross</span>
                </Title>
              </Header>
              <Image
                src="https://pbs.twimg.com/profile_images/910885630363688961/tWxPL76s_400x400.jpg"
                style={{
                  width: "100px",
                  height: "100px",
                  marginTop: "-60px",
                  marginLeft: "30px",
                  borderRadius: "50px",
                  boxShadow: "0px 10px 44px 0px rgba(90,123,224,0.39)"
                }}
              />
              <Desc
                style={{
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  color: "#797979",
                  fontFamily: "Nanum Gothic",
                  fontSize: "13px"
                }}
              >
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vulputate lacinia turpis, lobortis dignissim ligula malesuada consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vulputate lacinia turpis, lobortis dignissim ligula malesuada consequat.
                </span>
              </Desc>
            </BobBobCard>
          </Column>
          <Column col={4}>
            <BobBobCard
              style={{
                height: "400px",
                borderRadius: "10px",
                boxShadow: "0px 10px 44px 0px rgba(90,123,224,0.39)",
                width: "100%"
              }}
            >
              <Header
                style={{
                  backgroundImage: "url(http://materialdesignblog.com/wp-content/uploads/2016/06/image3.jpg)",
                  height: "200px",
                  borderTopRightRadius: "10px",
                  borderTopLeftRadius: "10px"
                }}
              >
                <Title
                  style={{
                    fontFamily: "Nanum Gothic",
                    margin: "0px",
                    color: "#ffffff",
                    position: "absolute",
                    right: "20px",
                    bottom: "20px"
                  }}
                >
                  <span>Bob Ross</span>
                </Title>
              </Header>
              <Image
                src="https://pbs.twimg.com/profile_images/910885630363688961/tWxPL76s_400x400.jpg"
                style={{
                  width: "100px",
                  height: "100px",
                  marginTop: "-60px",
                  marginLeft: "30px",
                  borderRadius: "50px",
                  boxShadow: "0px 10px 44px 0px rgba(90,123,224,0.39)"
                }}
              />
              <Desc
                style={{
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  color: "#797979",
                  fontFamily: "Nanum Gothic",
                  fontSize: "13px"
                }}
              >
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vulputate lacinia turpis, lobortis dignissim ligula malesuada consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vulputate lacinia turpis, lobortis dignissim ligula malesuada consequat.
                </span>
              </Desc>
            </BobBobCard>
          </Column>
        </Row>

      </div>
    ); // eslint-disable-line
  }
}

export default Page43;
