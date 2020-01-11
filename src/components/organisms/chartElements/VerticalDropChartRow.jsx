import React from "react"

import { VerticalDropChart } from "../../molecules"

export default function(props) {
  return (
    <>
      {props && (
        <VerticalDropChart
          {...props}
        />
      )}
    </>
  )
}
