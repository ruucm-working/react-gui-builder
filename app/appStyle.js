import { injectGlobal } from 'styled-components'

import normalize from 'ruucm-blocks/libs/normalize'

// import NanumSquare from 'ruucm-blocks/css-patterns/fonts/NanumSquare'
// import Montserrat from 'ruucm-blocks/css-patterns/fonts/Montserrat'
// import NanumMyeongjo from 'ruucm-blocks/css-patterns/fonts/NanumMyeongjo'
import FuturaPTWeb from 'ruucm-blocks/css-patterns/fonts/FuturaPTWeb'
import Omnes from 'ruucm-blocks/css-patterns/fonts/Omnes'

// App Styles
injectGlobal`
  ${normalize}
  /* Fonts */
  ${FuturaPTWeb}
  ${Omnes}
  /* Icons */
  /* Body Styles */
  body {

  }
`
