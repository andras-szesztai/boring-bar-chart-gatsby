import React from "react"
import styled, { css } from "styled-components"

const WIDTH = 100
const LINE_WIDTH = 20

const TooltipContainer = styled.div`
  position: absolute;
  width: ${WIDTH}px;
  height: 100px;

  ${({ left, top }) => css`
    left: ${left}px;
    top: ${top}px;
  `}

  border: 1px solid black;
  z-index: 5;
  pointer-events: none;
`

export default function Tooltip({
  hoveredMovie: { id, data, xPosition, x, yPosition },
}) {
  console.log("xPosition", xPosition)
  // console.log("id", id)
  // console.log("data", data)

  if (!id) return null
  return (
    <TooltipContainer
      left={xPosition ? x - WIDTH + LINE_WIDTH : x + LINE_WIDTH}
      top={5}
    ></TooltipContainer>
  )
}

// job: (2) ["Director", "Writer"]
// media_type: "movie"
// poster_path: "/glrievSqGcTj7O6AQlGdbwUAsWa.jpg"
// release_date: "1968-12-18"
// title: "Amblin'"
// vote_average: 6.3
// vote_count: 20
