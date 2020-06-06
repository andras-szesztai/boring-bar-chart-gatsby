import React from "react"
import styled, { css } from "styled-components"
import { Image } from "../../.."
import { dropShadow, space } from "../../../../../../../themes/theme"

const WIDTH = 240
const HEIGHT = 160
const LINE_WIDTH = 16

const TooltipContainer = styled.div`
  position: absolute;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;

  ${({ left, top, bottom }) => css`
    left: ${left}px;
    top: ${top}px;
    bottom: ${bottom}px;
  `}

  z-index: 5;
  pointer-events: none;

  padding: ${space[2]}px;

  border-radius: ${space[1]}px;
  background-color: #fff;
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});
`

export default function Tooltip({
  hoveredMovie: { id, data, xPosition, x, yPosition },
}) {
  console.log("xPosition", xPosition)
  // console.log("id", id)
  // console.log("data", data)

  // TODO: bottom or top 0
  if (!id) return null
  return (
    <TooltipContainer
      left={xPosition ? x - WIDTH - LINE_WIDTH : x + LINE_WIDTH * 2}
      top={0}
    >
      <Image
        url={data.poster_path}
        height={HEIGHT - space[3]}
        alt={`${data.title}-poster`}
      />
    </TooltipContainer>
  )
}

// job: (2) ["Director", "Writer"]
// media_type: "movie"
// poster_path: "/glrievSqGcTj7O6AQlGdbwUAsWa.jpg"
// release_date: "1968-12-18"
// title: "Amblin'"
// vote_average: 6.3
// vote_count: 20
