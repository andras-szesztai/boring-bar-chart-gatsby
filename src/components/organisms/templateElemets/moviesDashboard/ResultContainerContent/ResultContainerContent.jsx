import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

import { themifyFontSize } from "../../../../../themes/mixins"
import { COLORS } from "../../../../../constants/moviesDashboard"
import { space, dropShadow } from "../../../../../themes/theme"
import Image from "../Image/Image"

const ResultContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-template-rows: repeat(2, 1fr);
  grid-template-areas:
    "photo name"
    "photo job";
  grid-column-gap: 1rem;

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
  color: ${COLORS.primary};
  grid-area: name;
`

const JobContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: ${themifyFontSize(1)};
  font-weight: 200;
  grid-area: job;
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

export default function ResultContainerContent({
  nameSearchResults,
  index,
  zIndex,
  containerProps,
}) {
  return (
    <ResultContainer style={{ zIndex }} variants={variants} {...containerProps}>
      <Image
        height={52}
        url={nameSearchResults[index].profile_path}
        alt={nameSearchResults[index].name}
      />
      <NameContainer>{nameSearchResults[index].name}</NameContainer>
      <JobContainer>
        Known for: {nameSearchResults[index].known_for_department}
      </JobContainer>
    </ResultContainer>
  )
}
