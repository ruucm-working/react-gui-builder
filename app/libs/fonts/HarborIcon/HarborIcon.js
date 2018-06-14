import { css } from 'styled-components';
import Style from './Style';
import font1 from './fontFiles/harbor.eot';
import fontTTF from './fontFiles/harbor.ttf';
import fontWOFF from './fontFiles/harbor.woff';
import fontSVG from './fontFiles/harbor.svg';

const HarborIcon = css`
  /**
  *  Harbor Icons
  */
  @font-face {
    font-family: 'harbor';
    src:  url(${font1});
    src:  url(${font1}) format('embedded-opentype'),
      url(${fontTTF}) format('truetype'),
      url(${fontWOFF}) format('woff'),
      url(${fontSVG}) format('svg');
    font-weight: normal;
    font-style: normal;
  }
  ${Style}
  /* @import 'harbor-icons'; */
`

export default HarborIcon;
