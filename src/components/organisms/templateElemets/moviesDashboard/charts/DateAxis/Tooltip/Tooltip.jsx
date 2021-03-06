import React from "react"
import styled, { css } from "styled-components"
import capitalize from "lodash/capitalize"
import chroma from "chroma-js"
import { AnimatePresence, motion } from "framer-motion"
import numeral from "numeral"
import isFunction from "lodash/isFunction"

import { Image } from "../../.."
import { dropShadow, space } from "../../../../../../../themes/theme"
import {
  themifyFontSize,
  themifyFontWeight,
} from "../../../../../../../themes/mixins"
import { COLORS } from "../../../../../../../constants/moviesDashboard"

const WIDTH = 320
const HEIGHT = 160
export const LINE_WIDTH = space[3]

const TooltipContainer = styled.div`
  position: absolute;
  width: ${WIDTH}px;

  ${({ left, top, bottom }) => css`
    left: ${left}px;
    top: ${top}px;
    bottom: ${bottom}px;
  `}

  z-index: 4;
  pointer-events: none;

  padding: ${space[2]}px;

  border-radius: ${space[1]}px;
  background-color: #fff;
  filter: drop-shadow(${dropShadow.secondary});

  display: grid;
  grid-template-columns: minmax(105px, min-content) 1fr;
  grid-column-gap: 12px;
`

const ImageContainer = styled.div`
  height: ${HEIGHT}px;
`

const TextContentGrid = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  .title {
    font-size: ${themifyFontSize(2)};
    font-weight: ${themifyFontWeight(4)};
    color: ${COLORS.secondaryDark};
  }

  .section {
    margin-top: ${space[1]}px;
    font-size: ${themifyFontSize(1)};
    font-weight: ${themifyFontWeight(4)};
    color: ${COLORS.textColor};

    span {
      font-weight: ${themifyFontWeight(1)};
    }
  }

  .score {
    width: 100%;
    height: 16px;
    margin-top: 6px;
    margin-bottom: 1px;
    position: relative;
  }
`

export default function Tooltip({
  hoveredMovie: { id, data, xPosition, yPosition },
  activeMovieID,
  xScale,
}) {
  if (!id) return null
  const x = isFunction(xScale) && xScale(new Date(data.unified_date))
  return (
    <TooltipContainer
      key={id}
      left={xPosition ? x - WIDTH - LINE_WIDTH + 20 : x + LINE_WIDTH + 30}
      top={yPosition === 0 && 0}
      bottom={yPosition === 1 && 0}
    >
      <ImageContainer>
        <Image
          url={data.poster_path}
          height={HEIGHT}
          alt={`${data.title || data.name}-poster`}
        />
      </ImageContainer>
      <TextContentGrid>
        <div className="title">{data.title || data.name}</div>
        <div className="section">
          Release year: <span>{data.unified_year}</span>
        </div>
        <div className="section">
          Media type: <span>{capitalize(data.media_type)}</span>
        </div>
        <div className="section">
          {data.character ? "Character" : "Job"}:{" "}
          <span>
            {data.job &&
              (data.job.filter(Boolean).length ? data.job.join(", ") : "N/A")}
          </span>
        </div>
        <div className="section">
          <div>
            User score:{" "}
            <span>
              {numeral(data.vote_average).format("0.0")} &nbsp;
              <span>
                ({numeral(data.vote_count).format("0,0")} vote
                {data.vote_count > 1 ? "s" : ""})
              </span>
            </span>
          </div>
        </div>
        <div className="section score">
          <div
            style={{
              position: "absolute",
              width: `${data.vote_average * 10}%`,
              height: "100%",
              backgroundColor: COLORS.secondary,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              border: `1px solid ${chroma(COLORS.secondary).darken()}`,
              borderRadius: 2,
            }}
          />
        </div>
        <AnimatePresence>
          {activeMovieID !== id && (
            <motion.div
              className="section hint"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Click<span> to explore the {data.media_type}!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </TextContentGrid>
    </TooltipContainer>
  )
}
