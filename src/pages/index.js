import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import { Link } from "gatsby"

import { FlexContainer } from "../components/atoms"




export default function IndexPage({data}) {
  const { allContentfulVisualizationsLink: { edges: list } } = data
  console.log(list);
  
//   <p>
// Check out my <Link to="/blog">blog</Link>!
// </p>
// <p>
// {/* Note that external links still use `a` tags. */}
// Follow me on <a href="https://twitter.com/gatsbyjs">Twitter</a>!
// </p>
  return (
    <>
      <Helmet title="Boring Bar Chart" />
      <FlexContainer
        // fontSize={10}
        // fontWeight={0}
        fullScreen
        direction="column"
      >
      {
        list && list.map(({ node: { title, link, isOutside } }) => <div>{title}</div>)
      }
      </FlexContainer>
    </>
  )
}


export const query = graphql`
  {
    allContentfulVisualizationsLink(sort: {fields: date, order: DESC}) {
      edges {
        node {
          date
          title
          id
          description
          link
          isOutside
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
