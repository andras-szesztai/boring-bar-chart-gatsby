import { animated } from "react-spring"
import styled from "styled-components"

import { space } from "../../../../themes/theme"
import { themifyFontSize } from "../../../../themes/mixins"

const ItemPreviewContainer = styled(animated.div)`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: ${themifyFontSize(2)};

  overflow: hidden;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  border-radius: ${space[1]}px;
  height: 20rem;
  will-change: transform, opacity;

   @media (min-width: 700px) {
    height: 22rem;
  }

  @media (min-width: 1300px) {
    height: 25rem;
  }
`

export default ItemPreviewContainer
