import React from "react"
import styled from "styled-components"

import { IMAGE_ROOT } from "../../../../../constants/moviesDashboard"
import { colors } from "../../../../../themes/theme"

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
        background: colors.whiteDark,
        width: height * 0.66,
        height,
        borderRadius,
      }}
    />
  )
}
