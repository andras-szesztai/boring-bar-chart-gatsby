import styled, { css } from "styled-components"
import {
  themifyFontSize,
  themifyFontWeight,
  themifyColor,
  themifySpace,
} from "../../../themes/mixins"

const Container = styled.div`
  font-size: ${({ fontSize }) => themifyFontSize(fontSize)};
  font-weight: ${({ fontWeight }) => themifyFontWeight(fontWeight)};
  color: ${({ fontColor }) => themifyColor(fontColor)};
  background: ${({ bgColor }) => bgColor};

  ${({ absPos, bottom, right, top }) => absPos && css`
    position: absolute;
    bottom: ${bottom}px;
    right: ${right}px;
    top: ${top}px;
  `}

  ${({ fullScreen }) =>
    fullScreen &&
    css`
      height: 100vh;
      width: 100vw;
    `}

  ${({ fullSize }) =>
    fullSize &&
    css`
      height: 100%;
      width: 100%;
    `}

  ${({ fixSize, height, width }) =>
    fixSize &&
    css`
      height: ${height}px;
      width: ${width}px;
      white-space: nowrap;
    `}

  display: flex;
  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};
  flex-direction: ${({ direction }) => direction};
  padding-bottom: ${({paddingBottom}) => themifySpace(paddingBottom)}px;

  user-select: none;
  
`

export default Container

Container.defaultProps = {
  fontColor: "grayDarker",
  justify: "center",
  align: "center",
}
