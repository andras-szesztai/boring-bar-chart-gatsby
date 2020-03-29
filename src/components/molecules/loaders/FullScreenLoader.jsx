import React, { useState, useEffect } from "react"
import { PropagateLoader } from "react-spinners"

import { FlexContainer } from "../../atoms"
import { colors } from "../../../themes/theme"

export default function FullScreenLoader({
  timeOut,
  loaderSize,
  bgColor,
  loaderColor,
  loading: parentLoading,
}) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (parentLoading) {
      setLoading(false)
    }
    if (!parentLoading && loading) {
      setTimeout(() => setLoading(false), timeOut)
    }
  }, [parentLoading, loading, timeOut])
  return (
    <>
      {(loading || parentLoading) && (
        <FlexContainer
          fullScreen
          top={0}
          absPos
          bgColor={bgColor}
          fontColor="grayDarkest"
          zIndex="loader"
        >
          <PropagateLoader
            size={loaderSize}
            color={loaderColor}
            loading={parentLoading}
          />
        </FlexContainer>
      )}
    </>
  )
}

FullScreenLoader.defaultProps = {
  timeOut: 2000,
  loaderSize: 10,
  bgColor: colors.white,
  loaderColor: colors.grayDarker,
}
