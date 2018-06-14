import { css } from 'styled-components'

/**
 * Should add one more \, cause it's javascript !
 */
const Style = css`
  .magharbor {
    /* use !important to prevent issues with browser extensions that change fonts */
    font-family: 'magharbor' !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;

    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .magharbor-main-logo:before {
    content: '\\e900';
    color: #fff;
  }
`

export default Style
