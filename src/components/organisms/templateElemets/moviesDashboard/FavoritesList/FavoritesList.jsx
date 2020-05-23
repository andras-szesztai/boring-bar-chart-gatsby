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
} from "react-use"
import { IoMdInformationCircle, IoIosArrowForward } from "react-icons/io"
import { FaExpandArrowsAlt } from "react-icons/fa"
import useResizeAware from "react-resize-aware"
import { useSpring, useTransition, animated } from "react-spring"

import { space, dropShadow, colors } from "../../../../../themes/theme"
import { COLORS, TRANSITION } from "../../../../../constants/moviesDashboard"
import { themifyFontSize, themifyZIndex } from "../../../../../themes/mixins"
import { FavoriteStar, FavoriteHeart } from "../../../../molecules"
import { usePrevious, useArrayRefs } from "../../../../../hooks"
import {
  EndIconsContainer,
  RecentListContainer,
  ControlCollapsed,
  HiddenRecentListContainer,
  DisplayRecentListContainer,
} from "./styles"

const Container = styled(motion.div)`
  position: fixed;

  background-color: #fff;
  filter: drop-shadow(${dropShadow.primary});
  border: 1px solid ${colors.whiteDark};
  border-radius: ${space[1]}px;

  width: calc(100vw - ${space[3]}px);
  height: 90px;

  bottom: ${space[2]}px;
  left: ${space[2]}px;
  overflow: hidden;
`

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

const ListItemContainer = styled(animated.div)`
  bottom: 12px;
  font-size: ${themifyFontSize(3)};
  font-weight: 300;
  color: #fff;
  border-radius: ${space[1]}px;
  padding: 1px 12px;
  background-color: ${chroma(COLORS.primary)};
  border: 1px solid ${chroma(COLORS.primary).darken()};

  align-self: center;
  margin-left: ${space[2]}px;
  margin-right: ${space[2]}px;

  white-space: nowrap;
`

const CONTROL_WIDTH = 200

const ListItem = ({
  name,
  setElementDims,
  elementDims,
  runReCalc,
  setRunReCalc,
}) => {
  const prevElementDims = usePrevious(elementDims)
  const ref = useRef(null)
  useEffectOnce(() => {
    setElementDims(prev => [
      ...prev,
      { name, x: ref.current.getBoundingClientRect().x },
    ])
  })

  useEffect(() => {
    if (runReCalc) {
      setElementDims(prev => [
        ...prev.filter(el => el.name !== name),
        { name, x: ref.current.getBoundingClientRect().x },
      ])
      setRunReCalc(false)
    }
  }, [
    elementDims,
    name,
    prevElementDims,
    runReCalc,
    setElementDims,
    setRunReCalc,
  ])

  useUnmount(() => setElementDims(prev => prev.filter(el => el.name !== name)))

  return <ListItemContainer ref={ref}>{name}</ListItemContainer>
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

  const [isOpen, setIsOpen] = useState(true)
  const prevIsOpen = usePrevious(isOpen)
  const [listRef, dims] = useMeasure()
  const prevDims = usePrevious(dims)

  const [elementDims, setElementDims] = useState([])

  const transitions = useTransition(elementDims, item => item.name, {
    from: { transform: "translate3d(-200px, 0px, 0)" },
    enter: { transform: "translate3d(0px, 0px, 0)" },
    update: item => ({
      left: `${elementDims.find(el => el.name === item.name).x - 212}px`,
    }),
    leave: { transform: "translate3d(0px, 100px, 0)" },
    onDestroyed: () => setRunReCalc(true),
  })

  const endContainerAnim = useSpring({
    left: `${isOpen ? 215 + dims.width : 208}px`,
    boxShadow: `-1px 0px 3px 0 rgba(51,51,51,${isOpen ? 0.12 : 0})`,
    delay:
      !prevDims || prevDims.width < dims.width || isOpen !== prevIsOpen
        ? 0
        : 650,
  })
  const recentListAnim = useSpring({
    width: `${isOpen ? dims.width + 10 : 0}px`,
    delay:
      !prevDims || prevDims.width < dims.width || isOpen !== prevIsOpen
        ? 0
        : 650,
  })
  const ControlCollapsedAnim = useSpring({
    boxShadow: `1px 0px 3px 0 rgba(51,51,51,${isOpen ? 0.12 : 0})`,
  })

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
                  key={favorite.id}
                  name={favorite.name}
                  runReCalc={runReCalc}
                  setRunReCalc={setRunReCalc}
                />
              ))
          ))}
      </HiddenRecentListContainer>

      <DisplayRecentListContainer style={recentListAnim}>
        <div style={{ position: "relative" }}>
          {favoritesCombined &&
            (!favoritesCombined.length ? (
              <TextContainer style={{ fontWeight: 300, alignSelf: "center" }}>
                Mark a movie/series or person as a favorite to display them
                here!
              </TextContainer>
            ) : (
              transitions.map(({ item, props, key }) => (
                <ListItemContainer
                  key={key}
                  style={{ ...props, position: "absolute" }}
                >
                  {item.name}
                </ListItemContainer>
              ))
            ))}
        </div>
      </DisplayRecentListContainer>

      <ControlCollapsed style={ControlCollapsedAnim}>
        <Flex style={{ justifyContent: "space-evenly", alignItems: "center" }}>
          <motion.div
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
          </motion.div>
        </Flex>
      </ControlCollapsed>

      <EndIconsContainer style={endContainerAnim}>
        <IconContainer whileHover={{ scale: 1.3 }}>
          <FaExpandArrowsAlt size={16} color={COLORS.textColor} />
        </IconContainer>
        <IconContainer
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
