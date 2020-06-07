import React, { useState, useEffect } from "react"
import styled, { css } from "styled-components"
import useResizeAware from "react-resize-aware"
import capitalize from "lodash/capitalize"

import { Image } from "../../.."
import { dropShadow, space } from "../../../../../../../themes/theme"
import {
  themifyFontSize,
  themifyFontWeight,
} from "../../../../../../../themes/mixins"
import { COLORS } from "../../../../../../../constants/moviesDashboard"
import { useMeasure } from "react-use"

const WIDTH = 280
const HEIGHT = 160
const LINE_WIDTH = 16

const TooltipContainer = styled.div`
  position: absolute;
  width: ${WIDTH}px;

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

const ImageContainer = styled.div`
  height: ${HEIGHT}px;
`

const TextContentGrid = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;

  .title {
    font-size: ${themifyFontSize(1)};
    font-weight: ${themifyFontWeight(4)};
    color: ${COLORS.secondaryDark};
  }

  .date {
    font-size: ${themifyFontSize(1)};
    font-weight: ${themifyFontWeight(1)};
    color: ${COLORS.textColor};
  }
`

export default function Tooltip({
  hoveredMovie: { id, data, xPosition, x, yPosition },
}) {
  console.log("data", data)
  if (!id) return null
  return (
    <TooltipContainer
      key={id}
      left={xPosition ? x - WIDTH - LINE_WIDTH : x + LINE_WIDTH * 2}
      top={0}
    >
      <ImageContainer>
        <Image
          url={data.poster_path}
          height={HEIGHT}
          alt={`${data.title}-poster`}
        />
      </ImageContainer>
      <TextContentGrid>
        <div className="title">{data.title}</div>
        <div className="date">
          Release year: {data.release_date.slice(0, 4)}
        </div>
        <div className="date">Media type: {capitalize(data.media_type)}</div>
        <div className="date">
          {data.character ? "Character" : "Job"}: {data.job.filter(Boolean).length ? data.job.join(", ") : "N/A"}
        </div>
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
