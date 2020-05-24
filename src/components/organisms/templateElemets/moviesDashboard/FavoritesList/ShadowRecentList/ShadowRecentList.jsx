import React, { useRef, useState, useEffect } from "react"
import styled from "styled-components"
import { useEffectOnce, useUnmount } from "react-use"
import _ from "lodash"

import {
  RecentListContainer,
  ListItemContainer,
  TextContainer,
} from "../styles"
import { usePrevious } from "../../../../../../hooks"
import { FIXED_DIMS } from "../../../../../../constants/moviesDashboard"

export const HiddenRecentListContainer = styled(RecentListContainer)`
  opacity: 0;
  pointer-events: none;
  z-index: 0;

  /* opacity: 1;
  top: 10px;
  height: 80px; */
`

const ListItem = ({
  name,
  id,
  setElementDims,
  elementDims,
  runReCalc,
  setRunReCalc,
  expand,
  hoveredFavorite,
  extraMargin,
}) => {
  const prevElementDims = usePrevious(elementDims)
  const prevHoveredFavorite = usePrevious(hoveredFavorite)
  const ref = useRef(null)
  const initialWidth = useRef(null)
  useEffectOnce(() => {
    const dims = ref.current.getBoundingClientRect()
    setElementDims(prev => [
      ...prev,
      { name, id, x: dims.x, width: dims.width },
    ])
    initialWidth.current = dims.width
  })

  const [shouldReCalc, setShouldReCalc] = useState(false)
  useEffect(() => {
    if (!_.isEqual(hoveredFavorite, prevHoveredFavorite)) {
      setShouldReCalc(true)
    }
  }, [hoveredFavorite, prevHoveredFavorite])

  useEffect(() => {
    if (runReCalc || shouldReCalc) {
      const dims = ref.current.getBoundingClientRect()
      setElementDims(prev => [
        ...prev.filter(el => el.name !== name),
        { name, id, x: dims.x, width: dims.width },
      ])
      runReCalc && setRunReCalc(false)
      shouldReCalc && setShouldReCalc(false)
    }
  }, [
    elementDims,
    expand,
    id,
    name,
    prevElementDims,
    runReCalc,
    setElementDims,
    setRunReCalc,
    shouldReCalc,
  ])

  useUnmount(() => setElementDims(prev => prev.filter(el => el.name !== name)))

  return (
    <ListItemContainer
      ref={ref}
      style={{
        width:
          expand && initialWidth.current
            ? initialWidth.current + FIXED_DIMS.listItemGrowth
            : initialWidth.current,
      }}
      extramargin={extraMargin ? 1 : 0}
    >
      {name}
    </ListItemContainer>
  )
}

export default function ShadowRecentList({
  listRef,
  favoritesCombined,
  elementDims,
  setElementDims,
  hoveredFavorite,
  runReCalc,
  setRunReCalc
}) {
  return (
    <HiddenRecentListContainer ref={listRef}>
      {favoritesCombined &&
        (!favoritesCombined.length ? (
          <TextContainer style={{ fontWeight: 300, alignSelf: "center" }}>
            Mark a movie/series or person as a favorite to display them here!
          </TextContainer>
        ) : (
          favoritesCombined
            .filter((d, i) => i < 10)
            .map((favorite, i) => (
              <ListItem
                elementDims={elementDims}
                setElementDims={setElementDims}
                expand={
                  hoveredFavorite && favorite.name === hoveredFavorite.name
                }
                hoveredFavorite={hoveredFavorite}
                key={favorite.id}
                name={favorite.name}
                id={favorite.id}
                runReCalc={runReCalc}
                setRunReCalc={setRunReCalc}
                extraMargin={i === favoritesCombined.length - 1}
              />
            ))
        ))}
    </HiddenRecentListContainer>
  )
}
