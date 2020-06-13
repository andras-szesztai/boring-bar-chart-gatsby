import React, { useEffect } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import chroma from "chroma-js"

import { themifyFontSize } from "../../../../../../themes/mixins"
import {
  COLORS,
  LOCAL_STORE_ACCESSORS,
  OPACITY_VARIANT,
  ANIMATE_PROPS,
} from "../../../../../../constants/moviesDashboard"
import { space } from "../../../../../../themes/theme"
import { useLocalStorage } from "../../../../../../hooks"
import { FavoriteStar } from "../../../../../molecules"

const TextContainer = styled(motion.div)`
  width: 550px;
  font-size: ${themifyFontSize(2)};
  color: ${COLORS.textColor};
  margin-bottom: ${space[3]}px;
  line-height: 1.65;
`

const ColoredSpan = styled.span`
  padding: 0px ${space[2]}px 1px ${space[2]}px;
  background-color: ${({ color }) => color};
  border: 1px solid ${({ color }) => chroma(color).darken()};
  border-radius: 2px;
  color: #fff;
`

const LnkContainer = styled(motion.div)`
  padding: 0px ${space[2]}px 1px ${space[2]}px;
  position: absolute;
  overflow: hidden;
  background-color: #1da1f2;
  border: 1px solid ${chroma("#1DA1F2").darken()};
  border-radius: 2px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  left: 4px;
  top: -2px;
`

const Link = styled.a`
  text-decoration: none;
  color: #fff;
`

export const variants = {
  animate: {
    transition: {
      staggerChildren: 0.5,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
}

// TODO: animate paragraphs && setup alternative text
export default function IntroText() {
  const [isVisited, setIsVisited] = useLocalStorage(
    LOCAL_STORE_ACCESSORS.lockedPersonDetailCard,
    false
  )
  const startIsVisited = React.useRef(isVisited) // use to determine text
  useEffect(() => {
    if (!isVisited) {
      setIsVisited(true)
    }
  })

  const [isLinkHovered, setIsLinkHovered] = React.useState(false)
  return (
    <motion.div variants={OPACITY_VARIANT} {...ANIMATE_PROPS}>
      {startIsVisited ? (
        <TextContainer>
          Hey, welcome back! It is good to see you again.
        </TextContainer>
      ) : (
        <>
          <TextContainer>
            Hi there, thank you so much for passing by! Please let me welcome
            you on your first visit of this dashboard!
          </TextContainer>
          <TextContainer>
            To quickly explain the idea behind it, allow me to ask you a
            question: have you ever wanted to more easily explore discover more
            about the filmography of some of your favorite actors, directors or
            screenwriters? If your answer is yes, the good news is that the
            following dashboard attempts to help you to do exactly that!
          </TextContainer>
        </>
      )}
      <TextContainer>
        You can take a start already by typing a name into the{" "}
        <ColoredSpan color={COLORS.primary}>search bar</ColoredSpan> in the top
        left corner. When selecting a person from the results, you will see this
        middle part getting populated and you can start exploring the data by
        hovering over the elements and by just clicking around!
      </TextContainer>
      <TextContainer>
        The dashboard allows you also to mark persons and movies/series as your
        favorites{" "}
        <span style={{ position: "relative" }}>
          ‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎
          <span style={{ position: "absolute", top: -4, right: -8 }}>
            <FavoriteStar
              color={COLORS.favorite}
              isFavorited={true}
              width={30}
            />
          </span>
        </span>{" "}
        , which can help you with quick search options whenever you come back
        next time!
      </TextContainer>
      <TextContainer>
        Please keep in mind that this dashboard is a constant work in progress,
        and it will experience some changes in the near future by receiving some
        cool new features and getting some issues fixed. If you feel like share
        an idea about what type of features you would like to be added or any
        feedback about potential issues, please feel free to contact me anytime
        via{" "}
        <span style={{ position: "relative" }}>
          <LnkContainer
            initial={{ width: 59 }}
            animate={{ width: isLinkHovered ? 115 : 59 }}
          >
            <Link
              href="https://twitter.com/AndSzesztai"
              target="_blank"
              rel="noopener noreferrer"
              onMouseOver={() => setIsLinkHovered(true)}
              onMouseLeave={() => setIsLinkHovered(false)}
            >
              twitter
            </Link>
            <AnimatePresence>
              {isLinkHovered && (
                <motion.span
                  style={{ position: "absolute", left: 60 }}
                  variants={OPACITY_VARIANT}
                  {...ANIMATE_PROPS}
                >
                  let's go!
                </motion.span>
              )}
            </AnimatePresence>
          </LnkContainer>
        </span>
      </TextContainer>
      <TextContainer>
        Thank you so much and please enjoy your time exploring!
      </TextContainer>
    </motion.div>
  )
}
