import GridContainer from "../GridContainer/GridContainer"
import styled from "styled-components"

const MainGridOverview = styled(GridContainer)`
  transform: translateY(60px);
  padding: 4rem;
  overflow-y: auto;
  grid-row-gap: 3rem;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, 2fr);
    padding: 5rem 6rem;
    grid-column-gap: 4rem;
  }

  @media (min-width: 1300px) {
    padding: 7rem 8rem;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 6rem;
    grid-row-gap: 5rem;
  }
`

export default MainGridOverview
