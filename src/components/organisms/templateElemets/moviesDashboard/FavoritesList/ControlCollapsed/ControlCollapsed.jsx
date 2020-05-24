import React from "react"
import styled from "styled-components"
import { useSpring } from "react-spring"

import { ControlCollapsedContainer } from "../styles"

const Flex = styled.div`
  display: flex;
  flex-grow: 1;
  align-self: "center";
`

export default function ControlCollapsed({ isOpen }) {
  // const [isPersonsActive, setIsPersonsActive] = useState(true)
  // const [isMoviesActive, setIsMoviesActive] = useState(true)

  const ControlCollapsedAnim = useSpring({
    from: { transform: "translateX(-200px)" },
    transform: "translateX(0px)",
    boxShadow: `1px 0px 3px 0 rgba(51,51,51,${isOpen ? 0.12 : 0})`,
  })

  // TODO: make it flip on hover to show icons */

  return (
    <ControlCollapsedContainer style={ControlCollapsedAnim}>
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
    </ControlCollapsedContainer>
  )
}
