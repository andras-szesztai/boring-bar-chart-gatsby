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
  allContentfulChessPlayersData {
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
    }
  }
}
`
