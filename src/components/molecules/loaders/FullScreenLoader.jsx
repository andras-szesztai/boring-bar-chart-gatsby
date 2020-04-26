import React, { useState, useEffect, useRef, useLayoutEffect } from "react"
import { PropagateLoader, CircleLoader, ClipLoader } from "react-spinners"

import { FlexContainer } from "../../atoms"
import { colors } from "../../../themes/theme"
import { useScrollPosition } from "../../../hooks"
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

  const windowScroll = useRef(null)

  useLayoutEffect(() => {
    if (loading) {
      windowScroll.current = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = "hidden"
    }
    if (!loading) {
      setTimeout(() => {
        document.body.style.overflow = windowScroll.current
      }, 300)
    }
  }, [loading])

  const scrollPosition = useScrollPosition()

  const transitions = useTransition(parentLoading || loading, null, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: -1 },
  })
  console.log(loader)

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
