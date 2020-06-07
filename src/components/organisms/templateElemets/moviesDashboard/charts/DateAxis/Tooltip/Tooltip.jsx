import React from "react"
import styled, { css } from "styled-components"
import useResizeAware from 'react-resize-aware';

import { Image } from "../../.."
import { dropShadow, space } from "../../../../../../../themes/theme"

const WIDTH = 240
const HEIGHT = 160
const LINE_WIDTH = 16

const TooltipContainer = styled.div`
  position: absolute;
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
  filter: drop-shadow(${dropShadow.secondary});

  display: flex;
`

const TextContentGrid = styled.div`
  display: flex;
  white-space: nowrap;
  margin-left: ${space[2]}px;

  .title {

  }
`

export default function Tooltip({
  hoveredMovie: { id, data, xPosition, x, yPosition },
}) {
  const [resizeListener, sizes] = useResizeAware();
  console.log("sizes", sizes)
  // console.log("id", id)
  // console.log("data", data)

  // TODO: bottom or top 0
  if (!id) return null
  return (
    <TooltipContainer
      left={xPosition ? x - WIDTH - LINE_WIDTH : x + LINE_WIDTH * 2}
      top={0}
    >
      {resizeListener}
      <Image
        url={data.poster_path}
        height={HEIGHT - space[3]}
        alt={`${data.title}-poster`}
      />
      <TextContentGrid>
        <div>{data.title}</div>
      </TextContentGrid>
    </TooltipContainer>
  )
}

// poster_path: "/glrievSqGcTj7O6AQlGdbwUAsWa.jpg"

// title: "Amblin'"
// release_date: "1968-12-18"
// media_type: "movie"
// vote_average: 6.3
// vote_count: 20
// job: (2) ["Director", "Writer"]
