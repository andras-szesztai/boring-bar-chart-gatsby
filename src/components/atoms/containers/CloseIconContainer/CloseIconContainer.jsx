import styled from "styled-components"
import FlexContainer from "../FlexContainer/FlexContainer"
import { themifyColor, themifyTransition } from "../../../../themes/mixins"


const CloseIconContainer = styled(FlexContainer)`
.icon {
  fill: ${themifyColor("grayDarkest")};
  transition: fill ${themifyTransition("sm")};
}
:hover {
  .icon {
    fill: ${themifyColor("red")};
  }
}
`

export default CloseIconContainer