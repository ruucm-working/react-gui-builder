/**
 *
 * Page6
 *
 */

import React, { Component } from 'react'

import { Row, Column } from 'modules/Layout'
import { BobBobCard, Header, Title, Image, Desc } from 'modules/BobBobCard'

class Page6 extends Component {
  // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div>
        <Row>
          <Column
            col={4}
            style={{ height: '100%', backgroundColor: '#ffffff' }}
            mCol={6}
          >
            <BobBobCard
              style={{
                height: '400px',
                borderRadius: '10px',
                boxShadow: '0px 10px 44px 0px rgba(90,123,224,0.39)',
                width: '100%',
              }}
            >
              <Header
                style={{
                  backgroundImage:
                    'url(http://materialdesignblog.com/wp-content/uploads/2016/06/image3.jpg)',
                  height: '200px',
                  borderTopRightRadius: '10px',
                  borderTopLeftRadius: '10px',
                }}
              >
                <Title
                  style={{
                    fontFamily: 'Nanum Gothic',
                    margin: '0px',
                    color: '#ffffff',
                    position: 'absolute',
                    right: '20px',
                    bottom: '20px',
                  }}
                >
                  <span>Bob Ross</span>
                </Title>
              </Header>
              <Image
                src="https://pbs.twimg.com/profile_images/910885630363688961/tWxPL76s_400x400.jpg"
                style={{
                  width: '100px',
                  height: '100px',
                  marginTop: '-60px',
                  marginLeft: '30px',
                  borderRadius: '50px',
                  boxShadow: '0px 10px 44px 0px rgba(90,123,224,0.39)',
                }}
              />
              <Desc
                style={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  color: '#797979',
                  fontFamily: 'Nanum Gothic',
                  fontSize: '13px',
                }}
              >
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse vulputate lacinia turpis, lobortis dignissim
                  ligula malesuada consequat. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Suspendisse vulputate lacinia
                  turpis, lobortis dignissim ligula malesuada consequat.
                </span>
              </Desc>
            </BobBobCard>
          </Column>
          <Column
            col={4}
            style={{ height: '100%', backgroundColor: '#ffffff' }}
            mCol={6}
          >
            <BobBobCard
              style={{
                height: '400px',
                borderRadius: '10px',
                boxShadow: '0px 10px 44px 0px rgba(90,123,224,0.39)',
                width: '100%',
              }}
            >
              <Header
                style={{
                  backgroundImage:
                    'url(http://materialdesignblog.com/wp-content/uploads/2016/06/image3.jpg)',
                  height: '200px',
                  borderTopRightRadius: '10px',
                  borderTopLeftRadius: '10px',
                }}
              >
                <Title
                  style={{
                    fontFamily: 'Nanum Gothic',
                    margin: '0px',
                    color: '#ffffff',
                    position: 'absolute',
                    right: '20px',
                    bottom: '20px',
                  }}
                >
                  <span>Bob Ross</span>
                </Title>
              </Header>
              <Image
                src="https://pbs.twimg.com/profile_images/910885630363688961/tWxPL76s_400x400.jpg"
                style={{
                  width: '100px',
                  height: '100px',
                  marginTop: '-60px',
                  marginLeft: '30px',
                  borderRadius: '50px',
                  boxShadow: '0px 10px 44px 0px rgba(90,123,224,0.39)',
                }}
              />
              <Desc
                style={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  color: '#797979',
                  fontFamily: 'Nanum Gothic',
                  fontSize: '13px',
                }}
              >
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse vulputate lacinia turpis, lobortis dignissim
                  ligula malesuada consequat. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Suspendisse vulputate lacinia
                  turpis, lobortis dignissim ligula malesuada consequat.
                </span>
              </Desc>
            </BobBobCard>
          </Column>
          <Column
            col={4}
            style={{ height: '100%', backgroundColor: '#ffffff' }}
          >
            <BobBobCard
              style={{
                height: '400px',
                borderRadius: '10px',
                boxShadow: '0px 10px 44px 0px rgba(90,123,224,0.39)',
                width: '100%',
              }}
            >
              <Header
                style={{
                  backgroundImage:
                    'url(http://materialdesignblog.com/wp-content/uploads/2016/06/image3.jpg)',
                  height: '200px',
                  borderTopRightRadius: '10px',
                  borderTopLeftRadius: '10px',
                }}
              >
                <Title
                  style={{
                    fontFamily: 'Nanum Gothic',
                    margin: '0px',
                    color: '#ffffff',
                    position: 'absolute',
                    right: '20px',
                    bottom: '20px',
                  }}
                >
                  <span>Bob Ross</span>
                </Title>
              </Header>
              <Image
                src="https://pbs.twimg.com/profile_images/910885630363688961/tWxPL76s_400x400.jpg"
                style={{
                  width: '100px',
                  height: '100px',
                  marginTop: '-60px',
                  marginLeft: '30px',
                  borderRadius: '50px',
                  boxShadow: '0px 10px 44px 0px rgba(90,123,224,0.39)',
                }}
              />
              <Desc
                style={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  color: '#797979',
                  fontFamily: 'Nanum Gothic',
                  fontSize: '13px',
                }}
              >
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse vulputate lacinia turpis, lobortis dignissim
                  ligula malesuada consequat. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Suspendisse vulputate lacinia
                  turpis, lobortis dignissim ligula malesuada consequat.
                </span>
              </Desc>
            </BobBobCard>
          </Column>
        </Row>

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
              <span>Click on me and start creating a new cool component.</span>
            </h3>
          </div>
        </div>
      </div>
    ) // eslint-disable-line
  }
}

export default Page6
