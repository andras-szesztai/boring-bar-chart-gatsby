import { useState, useEffect } from "react"

import { useStateWithPrevious } from "../../../../../../hooks"

export default function useAnimationAccessor({ prevActiveMovie, activeMovie }) {
  const [
    isMovieDetailsCardOpen,
    setIsMovieDetailsCardOpen,
    prevIsMovieDetailsCardOpen,
  ] = useStateWithPrevious(true)

  const [accessor, setAcessor] = useState("animateFirst")

  useEffect(() => {
    if (prevActiveMovie) {
      if (isMovieDetailsCardOpen !== prevIsMovieDetailsCardOpen) {
        setAcessor(isMovieDetailsCardOpen ? "animateOpen" : "animateClose")
      }
    }
  }, [
    activeMovie,
    isMovieDetailsCardOpen,
    prevActiveMovie,
    prevIsMovieDetailsCardOpen,
    setIsMovieDetailsCardOpen,
  ])

  useEffect(() => {
    if (activeMovie.id !== prevActiveMovie.id) {
      setAcessor("animateFirst")
      setIsMovieDetailsCardOpen(true)
    }
  }, [activeMovie, prevActiveMovie, setIsMovieDetailsCardOpen])

  return { accessor, isMovieDetailsCardOpen, setIsMovieDetailsCardOpen }
}
