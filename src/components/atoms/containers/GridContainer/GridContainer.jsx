import styled, { css } from "styled-components"
import { Container } from "../"

const GridContainer = styled(Container)`
  display: grid;
  ${({ columns, rows, areas, rowGap, columnGap, align, justify, alignContent }) => css`
    grid-template-columns: ${columns};
    grid-template-rows: ${rows};
    grid-template-areas: ${areas};
    grid-row-gap: ${rowGap}rem;
    grid-column-gap: ${columnGap}rem;
    align-items: ${align};
    justify-items: ${justify};
    align-content:  ${alignContent};
  `}

  ${({ noGap }) =>
    noGap &&
    css`
      grid-row-gap: 0rem;
      grid-column-gap: 0rem;
    `}
`

GridContainer.defaultProps = {
  rowGap: 1,
  columnGap: 1,
}

export default GridContainer
