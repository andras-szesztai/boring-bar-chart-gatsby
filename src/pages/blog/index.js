import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { useTransition, animated } from "react-spring"
import PageTransition from "gatsby-plugin-page-transitions"

import { usePosts } from "../../hooks"
import { SiteHelmet } from "../../components/molecules"
import { Layout } from "../../components/templates"
import { GridContainer } from "../../components/atoms"

const MainGrid = styled(GridContainer)`
  padding: 4rem;
  overflow-y: auto;
  grid-row-gap: 1rem;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, 2fr);
    padding: 6rem;
    grid-column-gap: 0rem;
    grid-row-gap: 0rem;
    grid-template-rows: repeat(5, 10rem);
  }
  @media (min-width: 1300px) {
    padding: 8rem;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 6rem;
    grid-row-gap: 3rem;
    grid-template-rows: repeat(5, 10rem);
  }
`

const TestDiv = styled(animated.div)`
  overflow: hidden;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`

export default function() {
  const posts = usePosts()
  console.log(posts)
  const transitions = useTransition(posts, item => item.slug, {
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0)" },
  })
  return (
    <>
      <SiteHelmet />
      <PageTransition>
        <MainGrid>
          {transitions.map(({ item, key, props }) => (
            <TestDiv key={key} style={props} />
          ))}
        </MainGrid>
      </PageTransition>
    </>
  )
}
