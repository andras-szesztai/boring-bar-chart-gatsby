import React from "react"
import Helmet from 'react-helmet'

import { ChessPlayersDashboard } from "../../components/templates"

export default function() {
  return (
    <>
      <Helmet title="Chess Players ..." />
      <ChessPlayersDashboard />
    </>
  )
}
