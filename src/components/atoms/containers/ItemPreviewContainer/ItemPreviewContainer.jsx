import { animated } from "react-spring"
import styled from "styled-components"

import { space } from "../../../../themes/theme"

const ItemPreviewContainer = styled(animated.div)`
  overflow: hidden;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  border-radius: ${space[1]}px;
  will-change: transform, opacity;
  height: 20rem;

  @media (min-width: 700px) {
    height: 22rem;
  }

  @media (min-width: 1300px) {
    height: 25rem;
  }

`


export default ItemPreviewContainer
