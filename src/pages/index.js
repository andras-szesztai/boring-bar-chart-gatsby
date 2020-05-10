import React from "react"
import { graphql } from "gatsby"
import PageTransition from "gatsby-plugin-page-transitions"
import { useTransition, animated } from "react-spring"
import styled from "styled-components"

import { PortfolioItem, SiteHelmet } from "../components/molecules"
import { MainGridContainer } from "../components/atoms"
import { space } from "../themes/theme"

const ItemContainer = styled(animated.div)`
  overflow: hidden;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  border-radius: ${space[1]}px;

  height: 25rem;

  will-change: transform, opacity;
`

function IndexPage({ data }) {
  const {
    allContentfulVisualizationsLink: { edges: list },
  } = data

  const indexedList = list.map((node, i) => ({ ...node, index: i }))
  const transitions = useTransition(indexedList, item => item.node.title, {
    trail: 1000 / list.length,
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0)" },
  })

  return (
    <>
      <SiteHelmet pageTitle="Boring Bar Chart - Portfolio" />
      <PageTransition>
        <MainGridContainer>
          {transitions.map(({ item, key, props }) => (
            <ItemContainer key={key} style={props}>
              <PortfolioItem data={item.node} />
            </ItemContainer>
          ))}
        </MainGridContainer>
      </PageTransition>
    </>
  )
}

export default IndexPage

export const query = graphql`
  {
    allContentfulVisualizationsLink(sort: { fields: date, order: DESC }) {
      edges {
        node {
          date
          updated
          title
          id
          description
          link
          isOutside
          deviceTypes {
            mobile
            tablet
            desktop
          }
          image {
            fluid {
              ...GatsbyContentfulFluid_tracedSVG
            }
          }
        }
      }
    }
  }
`
