import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"
import {
  useMeasure,
  useUpdateEffect,
  useEffectOnce,
  useUnmount,
  useSize,
  useWindowSize,
} from "react-use"
import {
  IoMdInformationCircle,
  IoIosArrowForward,
  IoIosSearch,
  IoIosClose,
} from "react-icons/io"
import { FaExpandArrowsAlt } from "react-icons/fa"
import { useSpring, useTransition, animated } from "react-spring"

import { space } from "../../../../../themes/theme"
import { COLORS, TRANSITION } from "../../../../../constants/moviesDashboard"
import { themifyFontSize, themifyZIndex } from "../../../../../themes/mixins"
import { usePrevious } from "../../../../../hooks"
import {
  EndIconsContainer,
  ControlCollapsed,
  HiddenRecentListContainer,
  DisplayRecentListContainer,
  ListItemContainer,
  HoveredControlsContainer,
  HoverControlIconContainer,
} from "./styles"

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

const Flex = styled.div`
  display: flex;
  flex-grow: 1;
  align-self: "center";
`

const IconContainer = styled(motion.div)`
  right: ${space[1]}px;
  cursor: pointer;
  z-index: ${themifyZIndex("hoverOverlay")};
`

const ListItem = ({
  name,
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
    setElementDims(prev => [...prev, { name, x: dims.x, width: dims.width }])
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
        { name, x: dims.x, width: dims.width },
      ])
      runReCalc && setRunReCalc(false)
      shouldReCalc && setShouldReCalc(false)
    }
  }, [
    elementDims,
    expand,
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

export default function FavoritesList({ state, localStorageValues }) {
  const { favoritePersons } = localStorageValues
  const prevLocalStorageValues = usePrevious(localStorageValues)
  const [isPersonsActive, setIsPersonsActive] = useState(true)
  const [isMoviesActive, setIsMoviesActive] = useState(true)

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

  // TODO: Setup isOpen in local store
  const [isOpen, setIsOpen] = useState(true)
  const prevIsOpen = usePrevious(isOpen)
  const [listRef, dims] = useMeasure()
  const prevDims = usePrevious(dims)

  const [elementDims, setElementDims] = useState([])

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
    leave: { transform: "translate3d(0px, 2, 0)" },
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
  const ControlCollapsedAnim = useSpring({
    from: { transform: "translateX(-200px)" },
    transform: "translateX(0px)",
    boxShadow: `1px 0px 3px 0 rgba(51,51,51,${isOpen ? 0.12 : 0})`,
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

  const [ isRemoveHovered, setIsRemoveHovered ] = useState()

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
                  runReCalc={runReCalc}
                  setRunReCalc={setRunReCalc}
                  extraMargin={i === favoritesCombined.length - 1}
                />
              ))
          ))}
      </HiddenRecentListContainer>

      <DisplayRecentListContainer
        style={recentListAnim}
        onMouseLeave={() => setHoveredFavorite(undefined)}
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
                  onMouseEnter={() => setHoveredFavorite(item)}
                >
                  {item.name}
                  <AnimatePresence>
                    {hoveredFavorite && hoveredFavorite.name === item.name && (
                      <HoveredControlsContainer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.6 } }}
                        exit={{ opacity: 0 }}
                      >
                        <HoverControlIconContainer>
                          <motion.div
                            style={{ marginRight: 5 }}
                            initial={{ y: 2 }}
                            whileHover={{
                              scale: 1.3,
                            }}
                          >
                            <IoIosSearch size={16} />
                          </motion.div>
                          Search
                        </HoverControlIconContainer>
                        <HoverControlIconContainer>
                          <motion.div
                            style={{ marginRight: 1 }}
                            initial={{ y: 4 }}
                            whileHover={{
                              scale: 1.4,
                            }}
                          >
                            <IoIosClose size={18} />
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

      {/* // TODO: make it flip on hover to show icons */}
      <ControlCollapsed style={ControlCollapsedAnim}>
        <Flex style={{ justifyContent: "space-evenly", alignItems: "center" }}>
          Your recent favorites:
          {/* <motion.div
            whileHover={{ scale: 1.3 }}
            style={{ cursor: "pointer" }}
            onClick={() => setIsPersonsActive(prev => !prev)}
          >
            <FavoriteStar
              isFavorited={true}
              isHovered={false}
              color={COLORS.primary}
              isActive={isPersonsActive}
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.3 }}
            style={{ cursor: "pointer" }}
            onClick={() => setIsMoviesActive(prev => !prev)}
          >
            <FavoriteStar
              isFavorited={true}
              isHovered={false}
              color={COLORS.secondary}
              isActive={isMoviesActive}
            />
          </motion.div> */}
        </Flex>
      </ControlCollapsed>

      <EndIconsContainer style={endContainerAnim}>
        <IconContainer
          style={{ transform: "translateY(5px)" }}
          onClick={() => setIsOpen(prev => !prev)}
          whileHover={{
            scale: 1.3,
            transition: {
              delay: 0,
            },
          }}
          initial={{ rotate: isOpen ? 180 : 0 }}
          animate={{
            rotate: isOpen ? 180 : 0,
            transition: {
              delay: 1,
            },
          }}
        >
          <IoIosArrowForward size={24} color={COLORS.textColor} />
        </IconContainer>
      </EndIconsContainer>
    </>
  )
}
