import styled from 'styled-components';
import media from '../../../tools/media'
 
const PaddingWrapper = styled.div`
  padding: ${props => props.padding};
  ${media.phone`
    padding: ${props => props.mPadding}
  `}
`
export default PaddingWrapper;
