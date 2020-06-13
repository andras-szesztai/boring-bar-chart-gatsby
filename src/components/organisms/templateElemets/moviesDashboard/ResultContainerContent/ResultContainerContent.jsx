import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

import {
  themifyFontSize,
  themifyFontWeight,
} from "../../../../../themes/mixins"
import { COLORS } from "../../../../../constants/moviesDashboard"
import { space, dropShadow } from "../../../../../themes/theme"
import Image from "../Image/Image"

const ResultContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: 35px 1fr;
  grid-template-rows: repeat(2, 50%);
  grid-template-areas:
    "photo name"
    "photo job";
  grid-column-gap: 1.5rem;

  align-self: start;
  width: calc(100% - 10px);
  height: 60px;
  border-radius: ${space[1]}px;
  background-color: #fff;
  filter: drop-shadow(${dropShadow.primary});
  margin: 5px;
  padding: 4px 6px;
`

const NameContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: ${themifyFontSize(2)};
  font-weight: 500;
  color: ${({color}) => color};
  grid-area: name;
  margin-top: 2px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const JobContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: ${themifyFontSize(1)};
  font-weight: ${themifyFontWeight(4)};
  grid-area: job;
  margin-bottom: 3px;
  color: ${COLORS.textColor};

  span {
    font-weight: ${themifyFontWeight(1)};
  }
`

const variants = {
  enter: { y: "-100%", opacity: 0 },
  animate: {
    y: "0%",
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
    },
  },
  exit: {
    y: "-100%",
    opacity: -1,
    transition: {
      type: "spring",
      damping: 12,
    },
  },
}

export default function ResultContent({
  data,
  zIndex,
  handleClick,
  handleMouseOver,
  accessors,
}) {
  const title = data[accessors.imgAlt] || data[accessors.imgAltSecondary]
  return (
    <ResultContainer
      style={{ zIndex }}
      variants={variants}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
    >
      <Image height={52} url={data[accessors.img]} alt={title} />
      <NameContainer color={accessors.color}>{title}</NameContainer>
      <JobContainer>
        {accessors.subText}:&nbsp;<span>{data[accessors.subTextValue]}</span>
      </JobContainer>
    </ResultContainer>
  )
}
