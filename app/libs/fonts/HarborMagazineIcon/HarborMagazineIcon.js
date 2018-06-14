import { css } from 'styled-components'
import Style from './Style'
import font1 from './fontFiles/magharbor.eot'
import fontTTF from './fontFiles/magharbor.ttf'
import fontWOFF from './fontFiles/magharbor.woff'
import fontSVG from './fontFiles/magharbor.svg'

const HarborMagazineIcon = css`
  /**
  *  Harbor Icons
  */
  @font-face {
    font-family: 'magharbor';
    src: url(${font1});
    src: url(${font1}) format('embedded-opentype'),
      url(${fontTTF}) format('truetype'), url(${fontWOFF}) format('woff'),
      url(${fontSVG}) format('svg');
    font-weight: normal;
    font-style: normal;
  }
  ${Style} /* @import 'harbor-icons'; */;
`

export default HarborMagazineIcon
