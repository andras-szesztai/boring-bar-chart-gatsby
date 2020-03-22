import { useState, useEffect } from "react"

function getWindowDimensions() {
  const { innerWidth: windowWidth, innerHeight: windowHeight } = window
  return {
    windowWidth,
    windowHeight,
  }
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    windowWidth: undefined,
    windowHeight: undefined,
  })

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }
    if (!windowDimensions.windowWidth && window) {
      handleResize()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [windowDimensions.windowWidth])

  return windowDimensions
}
