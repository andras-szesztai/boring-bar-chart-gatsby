import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import _ from "lodash"
import { useMeasure, useEffectOnce, useUnmount, useWindowSize } from "react-use"
import { IoIosSearch, IoIosClose } from "react-icons/io"
import { useSpring, useTransition } from "react-spring"

import { space } from "../../../../../themes/theme"
import { COLORS } from "../../../../../constants/moviesDashboard"
import { themifyFontSize } from "../../../../../themes/mixins"
import { usePrevious } from "../../../../../hooks"
import {
  HiddenRecentListContainer,
  DisplayRecentListContainer,
  ListItemContainer,
  HoveredControlsContainer,
  HoverControlIconContainer,
  MouseDownAnimation,
} from "./styles"
import ControlCollapsed from "./ControlCollapsed/ControlCollapsed"
import EndIconsContainer from "./EndIconsContainer/EndIconsContainer"

const TextContainer = styled(motion.div)`
  font-weight: 500;
  font-size: ${themifyFontSize(2)};
  color: ${COLORS.textColor};
  font-family: inherit;

  display: flex;
  align-items: center;
  height: 100%;
  padding: ${space[2]}px;
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
            ? initialWidth.current + 180
            : initialWidth.current,
      }}
      extramargin={extraMargin ? 1 : 0}
    >
      {name}
    </ListItemContainer>
  )
}

export default function FavoritesList({
  actions,
  state,
  localStorageValues,
  localStorageSetters,
}) {
  const { favoritePersons } = localStorageValues
  const { setFavoritePersons } = localStorageSetters
  const prevLocalStorageValues = usePrevious(localStorageValues)

  const { setActiveNameID } = actions

  const [runReCalc, setRunReCalc] = useState(false)
  const [favoritesCombined, setFavoriteCombined] = useState(undefined)
  useEffect(() => {
    if (!favoritesCombined) {
      setFavoriteCombined(
        [...favoritePersons].sort((a, b) => new Date(b.date) - new Date(a.date))
      )
    }
    if (
      prevLocalStorageValues &&
      !_.isEqual(favoritePersons, prevLocalStorageValues.favoritePersons)
    ) {
      setFavoriteCombined(
        [...favoritePersons].sort((a, b) => new Date(b.date) - new Date(a.date))
      )
      if (
        favoritePersons.length > prevLocalStorageValues.favoritePersons.length
      ) {
        setRunReCalc(true)
      }
    }
  }, [favoritesCombined, favoritePersons, prevLocalStorageValues])

  const [isOpen, setIsOpen] = useState(false)
  const prevIsOpen = usePrevious(isOpen)
  const [listRef, dims] = useMeasure()
  const prevDims = usePrevious(dims)

  const [elementDims, setElementDims] = useState([])
  const prevElementDims = usePrevious(elementDims)
  const [hoveredFavorite, setHoveredFavorite] = useState(undefined)

  const transitions = useTransition(elementDims, item => item.name, {
    from: { opacity: 0, transform: "translate3d(-200px, 2px, 0)" },
    enter: item => ({
      opacity: 1,
      transform: `translate3d(${elementDims.find(el => el.name === item.name)
        .x - 212}px, 2px, 0)`,
    }),
    update: item => {
      const curreItem = elementDims.find(el => el.name === item.name)
      return {
        transform: `translate3d(${curreItem.x - 212}px, 2px, 0)`,
        width: `${curreItem.width}px`,
      }
    },
    leave: item => ({
      transform: `translate3d(${prevElementDims.find(
        el => el.name === item.name
      ).x - 212}px, 100px, 0)`,
    }),
    onDestroyed: () => setRunReCalc(true),
  })

  const { width } = useWindowSize()
  const maxWidth = width - 2 * space[2] - 200 - 40

  const endContainerXPos = isOpen
    ? 210 + (dims.width <= maxWidth ? dims.width : maxWidth)
    : 208
  const endContainerAnim = useSpring({
    from: {
      transform: `translate(${endContainerXPos}px, 100px)`,
    },
    transform: `translate(${endContainerXPos}px, 0px)`,
    boxShadow: `-1px 0px 3px 0 rgba(51,51,51,${isOpen ? 0.12 : 0})`,
    delay:
      !prevDims ||
      prevDims.width < dims.width ||
      isOpen !== prevIsOpen ||
      prevDims.width - dims.width === 180
        ? 0
        : 650,
  })
  const recentListAnim = useSpring({
    width: `${isOpen ? dims.width + 5 : 0}px`,
    delay:
      !prevDims ||
      prevDims.width < dims.width ||
      isOpen !== prevIsOpen ||
      prevDims.width - dims.width === 180
        ? 0
        : 650,
  })

  const placholderAnim = useSpring({
    left: `${
      _.last(elementDims)
        ? _.last(elementDims).x -
          (hoveredFavorite && hoveredFavorite.name === _.last(elementDims).name
            ? 20
            : 140)
        : 10
    }px`,
  })

  const [isRemoveHovered, setIsRemoveHovered] = useState(false)
  const [isSearchHovered, setIsSearchHovered] = useState(false)

  const [clickedRemove, setClickedRemove] = useState(undefined)
  const [clickedSearch, setClickedSearch] = useState(undefined)

  const timeOut = useRef(null)

  return (
    <>
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

      <DisplayRecentListContainer
        style={recentListAnim}
        onMouseLeave={() => {
          setHoveredFavorite(undefined)
          setClickedRemove(undefined)
        }}
      >
        <div style={{ position: "relative" }}>
          {favoritesCombined &&
            (!favoritesCombined.length ? (
              <TextContainer style={{ fontWeight: 300, alignSelf: "center" }}>
                Mark a movie/series or person as a favorite to display them
                here!
              </TextContainer>
            ) : (
              transitions.map(({ item, props, key }, i) => (
                <ListItemContainer
                  key={key}
                  style={{
                    ...props,
                    position: "absolute",
                  }}
                  onMouseEnter={() => {
                    setHoveredFavorite(item)
                    setClickedRemove(undefined)
                  }}
                >
                  {item.name}
                  <AnimatePresence>
                    {hoveredFavorite && hoveredFavorite.name === item.name && (
                      <HoveredControlsContainer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.6 } }}
                        exit={{
                          opacity: 0,
                          transition: {
                            duration: 0,
                            type: "tween",
                          },
                        }}
                      >
                        <HoverControlIconContainer
                          style={{
                            color:
                              state.activeNameID === item.id &&
                              "rgba(255, 255, 255, .25)",
                          }}
                          onMouseEnter={() => {
                            if (state.activeNameID !== item.id) {
                              setIsSearchHovered(true)
                            }
                          }}
                          onMouseLeave={() => {
                            clearTimeout(timeOut.current)
                            setClickedSearch(undefined)
                            setIsSearchHovered(false)
                          }}
                          onMouseDown={() => {
                            if (state.activeNameID !== item.id) {
                              setClickedSearch(item.id)
                              timeOut.current = setTimeout(
                                () => setActiveNameID(item.id),
                                1000
                              )
                            }
                          }}
                          onMouseUp={() => {
                            clearTimeout(timeOut.current)
                            setClickedSearch(undefined)
                          }}
                          whileTap={
                            state.activeNameID === item.id && {
                              x: 3,
                              transition: {
                                flip: Infinity,
                                duration: 0.2,
                                ease: [0.65, 0, 0.35, 1],
                              },
                            }
                          }
                        >
                          {state.activeNameID !== item.id && (
                            <MouseDownAnimation
                              initial={{ width: "0%", x: -5 }}
                              animate={{
                                width:
                                  clickedSearch && clickedSearch === item.id
                                    ? "120%"
                                    : "0%",
                              }}
                              transition={{
                                duration: 1,
                                type: "tween",
                                ease: [0.65, 0, 0.35, 1],
                              }}
                            />
                          )}
                          <motion.div
                            style={{ marginRight: 4 }}
                            initial={{ y: 2 }}
                            animate={{ scale: isSearchHovered ? 1.4 : 1 }}
                          >
                            <IoIosSearch size={14} />
                          </motion.div>
                          Search
                        </HoverControlIconContainer>
                        <HoverControlIconContainer
                          onMouseEnter={() => setIsRemoveHovered(true)}
                          onMouseLeave={() => {
                            clearTimeout(timeOut.current)
                            setClickedRemove(undefined)
                            setIsRemoveHovered(false)
                          }}
                          onMouseDown={() => {
                            setClickedRemove(item.id)
                            timeOut.current = setTimeout(
                              () =>
                                setFavoritePersons(prev =>
                                  prev.filter(d => d.id !== item.id)
                                ),
                              1000
                            )
                          }}
                          onMouseUp={() => {
                            clearTimeout(timeOut.current)
                            setClickedRemove(undefined)
                          }}
                        >
                          <MouseDownAnimation
                            initial={{ width: "0%", x: -5 }}
                            animate={{
                              width:
                                clickedRemove && clickedRemove === item.id
                                  ? "120%"
                                  : "0%",
                            }}
                            transition={{
                              duration: 1,
                              type: "tween",
                              ease: [0.65, 0, 0.35, 1],
                            }}
                          />
                          <motion.div
                            style={{ marginRight: 2 }}
                            initial={{ y: 2 }}
                            animate={{ scale: isRemoveHovered ? 1.6 : 1 }}
                          >
                            <IoIosClose size={14} />
                          </motion.div>
                          Remove
                        </HoverControlIconContainer>
                      </HoveredControlsContainer>
                    )}
                  </AnimatePresence>
                </ListItemContainer>
              ))
            ))}

          {dims.width > maxWidth && (
            <ListItemContainer
              style={{ ...placholderAnim, position: "absolute", opacity: 0 }}
            />
          )}
        </div>
      </DisplayRecentListContainer>

      <ControlCollapsed isOpen={isOpen} />

      <EndIconsContainer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        endContainerAnim={endContainerAnim}
      />
    </>
  )
}
