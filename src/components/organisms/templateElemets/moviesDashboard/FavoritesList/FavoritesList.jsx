import React, { useState, useEffect } from "react"
import _ from "lodash"
import styled from "styled-components"
import { motion } from "framer-motion"
import { IoIosSearch } from "react-icons/io"

import { space, dropShadow } from "../../../../../themes/theme"
import { usePrevious } from "../../../../../hooks"
import HorizontalScrollList from "../HorizontalScrollList/HorizontalScrollList"
import { themifyFontSize } from "../../../../../themes/mixins"
import { COLORS } from "../../../../../constants/moviesDashboard"

const HoverContent = ({ animateProps, data, isMatch }) => {
  return (
    <motion.div initial={{ opacity: 0 }} {...animateProps}>
      {isMatch
        ? data.id === -99
          ? " . . . as one of your favorites!"
          : "Already selected, let's explore! "
        : "Hold down right click to search!"}
    </motion.div>
  )
}

const Container = styled(motion.div)`
  position: fixed;
  left: ${space[2]}px;
  bottom: ${space[2]}px;
  background-color: #fff;
  border-radius: 2px;
  width: calc(100vw - ${space[3]}px);
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});
  height: 56px;

  display: grid;
  grid-template-columns: max-content 1fr;
  grid-column-gap: ${space[4]}px;

  font-size: ${themifyFontSize(2)};
  color: ${COLORS.textColor};
  z-index: 10;

  padding: ${space[2]}px ${space[2]}px ${space[2]}px ${space[3]}px;
`

const TextContainer = styled.div`
  display: flex;
  align-items: center;

  padding: ${space[2]}px;
  margin-bottom: 1px;
`

const MouseDownContent = ({ bgColor }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 2,
        left: 5,
      }}
    >
      <IoIosSearch size={20} color={bgColor} />{" "}
    </div>
  )
}

export default function FavoritesList({ actions, state, localStorageValues }) {
  const { favoritePersons } = localStorageValues
  const prevLocalStorageValues = usePrevious(localStorageValues)

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
    }
  }, [favoritesCombined, favoritePersons, prevLocalStorageValues])

  return (
    <>
      <Container>
        <TextContainer>Your recent favorites</TextContainer>
        <HorizontalScrollList
          type="favorites"
          array={
            favoritesCombined && favoritesCombined.length
              ? favoritesCombined
              : [
                  {
                    id: -99,
                    name:
                      "Please start your list by adding a person . . . ",
                  },
                ]
          }
          bgColor={COLORS.primary}
          hoverContent={HoverContent}
          mouseDownContent={MouseDownContent}
          mouseDownAnimationAdjust={3}
          activeNameID={state.activeNameID}
          setActiveNameID={actions.setActiveNameID}
        />
      </Container>
    </>
  )
}
