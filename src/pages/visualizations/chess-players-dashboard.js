import React from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"

import { ChessPlayersDashboard } from "../../components/templates"

export default function({
  data: {
    allContentfulChessPlayersData: { nodes },
    allImageSharp: { nodes: images },
  },
}) {
  return (
    <>
      <Helmet title="Chess Players ..." />
      <ChessPlayersDashboard data={nodes} img={images} />
    </>
  )
}

export const query = graphql`
  {
    allContentfulChessPlayersData(sort: { fields: dob, order: ASC }) {
      nodes {
        id
        nameId
        dataSet {
          player_elo
          player
          year
          result
          opponent_elo
          moves
          game_id
        }
        image {
          fluid {
            ...GatsbyContentfulFluid_tracedSVG
          }
        }
        fullName
        bio {
          bio
        }
      }
    }
    allImageSharp(filter: { fluid: { originalName: { eq: "boxplot.png" } } }) {
      nodes {
        fluid {
          ...GatsbyImageSharpFluid_tracedSVG
        }
      }
    }
  }
`
