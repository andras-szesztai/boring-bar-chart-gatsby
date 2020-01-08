import React from "react"
import styled from "styled-components"

import { VerticalDropChart } from "../../molecules"

export default function({ data, xAxis, domain, colors }) {
  return (
    <div>
      {domain && (
        <VerticalDropChart
          data={data}
          xAxis={xAxis}
          domain={domain}
          colors={colors}
          margin={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 20
          }}
        />
      )}
    </div>
  )
}
