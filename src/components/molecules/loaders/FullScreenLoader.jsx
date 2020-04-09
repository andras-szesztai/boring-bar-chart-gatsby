import React, { useState, useEffect } from "react"
import { PropagateLoader, CircleLoader, ClipLoader } from "react-spinners"

import { FlexContainer } from "../../atoms"
import { colors } from "../../../themes/theme"
import { useScrollPosition } from "../../../hooks"

export default function FullScreenLoader({
  timeOut,
  loaderSize,
  bgColor,
  loaderColor,
  loading: parentLoading,
  loader,
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

  const loaderProps = {
    size: loaderSize,
    color: loaderColor,
    loading: parentLoading,
  }
  const loaders = {
    propagate: <PropagateLoader {...loaderProps} />,
    circle: <CircleLoader {...loaderProps} />,
    clip: <ClipLoader {...loaderProps} />,
  }

  const scrollPosition = useScrollPosition()

  return (
    <>
      {(loading || parentLoading) && (
        <FlexContainer
          fullScreen
          top={scrollPosition}
          absPos
          bgColor={bgColor}
          fontColor="grayDarkest"
          zIndex="loader"
        >
          {loaders[loader]}
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
  loader: "propagate",
}
