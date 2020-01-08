import React from "react"
import styled from "styled-components"

import { VerticalDropChart } from "../../molecules"

export default function({ data, xAxis, domain, colors, margin }) {
  return (
    <div>
      {domain && (
        <VerticalDropChart
          data={data}
          xAxis={xAxis}
          domain={domain}
          colors={colors}
          margin={margin}
        />
      )}
    </div>
  )
}
