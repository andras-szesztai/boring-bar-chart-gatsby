import React from "react"
import styled from "styled-components"

import { themifyFontSize } from "../../../../../themes/mixins"
import { COLORS, IMAGE_ROOT } from "../../../../../constants/moviesDashboard"

const ImageContainer = styled.img`
  height: 100%;
  grid-area: photo;
  border-radius: 2px;
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

export default function ResultContainerContent({ nameSearchResults, index }) {
  return (
    <>
      {nameSearchResults[index].profile_path ? (
        <ImageContainer
          src={`${IMAGE_ROOT}/${nameSearchResults[index].profile_path}`}
          alt={nameSearchResults[index].name}
        />
      ) : (
        <div
          style={{
            gridArea: "photo",
            background: "#f2f2f2",
            width: 35,
            height: 52,
            borderRadius: 2,
          }}
        />
      )}
      <NameContainer>{nameSearchResults[index].name}</NameContainer>
      <JobContainer>
        Known for: {nameSearchResults[index].known_for_department}
      </JobContainer>
    </>
  )
}
