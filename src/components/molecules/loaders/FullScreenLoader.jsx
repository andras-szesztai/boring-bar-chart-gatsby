import React, { useState, useEffect } from "react"
import { PropagateLoader } from "react-spinners"

import { FlexContainer } from "../../atoms"
import { colors } from "../../../themes/theme"

export default function FullScreenLoader({
  timeOut,
  loaderSize,
  bgColor,
  loaderColor,
}) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), timeOut)
    }
  })

  return (
    <>
      {loading && (
        <FlexContainer
          fullSize
          fullScreen
          absPos
          bgColor={bgColor}
          fontColor="grayDarkest"
          zIndex="loader"
        >
          <PropagateLoader
            size={loaderSize}
            color={loaderColor}
            loading={loading}
          />
        </FlexContainer>
      )}
    </>
  )
}

FullScreenLoader.defaultProps = {
  timeOut: 2000,
  loaderSize: 10,
  bgColor: colors.whiteDark,
  loaderColor: colors.grayDark,
}
