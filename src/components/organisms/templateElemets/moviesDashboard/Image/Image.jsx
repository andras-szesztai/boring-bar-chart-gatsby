import React from "react"
import styled from "styled-components"

import { IMAGE_ROOT } from "../../../../../constants/moviesDashboard"

const ImageContainer = styled.img`
  height: 100%;
  grid-area: photo;
  border-radius: 2px;
`

export default function Image({
  url,
  height,
  alt,
  borderRadius = 2,
}) {
  return url ? (
    <ImageContainer src={`${IMAGE_ROOT}/${url}`} alt={alt} />
  ) : (
    <div
      style={{
        gridArea: "photo",
        background: "#f2f2f2",
        minWidth: height * 0.66,
        height,
        borderRadius,
      }}
    />
  )
}
