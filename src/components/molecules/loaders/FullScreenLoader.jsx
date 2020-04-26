import React, { useState, useEffect, useLayoutEffect } from "react"
import { PropagateLoader, CircleLoader, ClipLoader } from "react-spinners"

import { FlexContainer } from "../../atoms"
import { colors } from "../../../themes/theme"
import { useScrollPosition, usePrevious } from "../../../hooks"
import { useTransition } from "react-spring"

export default function FullScreenLoader({
  timeOut,
  loaderSize,
  bgColor,
  loaderColor,
  loading: parentLoading,
  loader,
}) {
  const [loading, setLoading] = useState(true)
  const prevParentLoading = usePrevious(parentLoading)
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
    loading: true,
  }
  const loaders = {
    propagate: <PropagateLoader {...loaderProps} />,
    circle: <CircleLoader {...loaderProps} />,
    clip: <ClipLoader {...loaderProps} />,
  }

  useLayoutEffect(() => {
    if (parentLoading) {
      document.body.style.overflow = "hidden"
    }
    if (!parentLoading && prevParentLoading) {
      setTimeout(() => {
        document.body.style.overflow = "visible"
      }, 500)
    }
  }, [loading, parentLoading, prevParentLoading])

  const scrollPosition = useScrollPosition()

  const transitions = useTransition(parentLoading || loading, null, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: -1 },
  })

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <FlexContainer
          key={key}
          style={props}
          fullScreen
          top={scrollPosition}
          absPos
          bgColor={bgColor}
          fontColor="grayDarkest"
          zIndex="loader"
        >
          {loaders[loader]}
        </FlexContainer>
      )
  )
}

FullScreenLoader.defaultProps = {
  timeOut: 2000,
  loaderSize: 10,
  bgColor: colors.white,
  loaderColor: colors.grayDarker,
  loader: "propagate",
}
