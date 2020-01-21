import React from "react"
import Helmet from 'react-helmet'
import { graphql } from "gatsby"

import { ChessPlayersDashboard } from "../../components/templates"

export default function({data: {allContentfulChessPlayersData: {nodes}} }) {

  return (
    <>
      <Helmet title="Chess Players ..." />
      <ChessPlayersDashboard data={nodes} />
    </>
  )
}


export const query = graphql`
{
  allContentfulChessPlayersData(sort: {fields: dob, order: ASC}) {
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
    }
  }
}
`
