import React, { useRef } from "react"
import { ChartStarter } from "../../../../molecules"
import {
  useChartRefs,
  useDimensions,
  useInitUpdate,
} from "../../../../../hooks"
import { ChartWrapper, ChartSvg, ChartArea, AxisLine } from "../../../../atoms"

export default function AreaChart({ data, margin }) {
  const refs = useChartRefs()
  const valueStore = useRef()
  const dims = useDimensions({
    ref: refs.wrapperRef,
    margin,
  })

  console.log(dims)

  useInitUpdate({
    data: data && Object.values(data),
    chartHeight: dims.chartHeight,
    chartWidth: dims.chartWidth,
    // initVis,
    // updateVisDims,
  })

  console.log(dims)

  return (
    <>
      <ChartWrapper ref={refs.wrapperRef}>
        <ChartSvg
          absPos
          ref={refs.svgRef}
          width={dims.width}
          height={dims.height}
        >
          <ChartArea
            ref={refs.xAxisRef}
            marginLeft={dims.left}
            marginTop={dims.top + dims.chartHeight}
          >
            <AxisLine/>
          </ChartArea>
          <ChartArea
            ref={refs.yAxisRef}
            marginLeft={dims.left}
            marginTop={dims.top}
          >
            <AxisLine/>
          </ChartArea>
          <ChartArea
            ref={refs.areaRef}
            marginLeft={margin.left}
            marginTop={margin.top}
          />
        </ChartSvg>
      </ChartWrapper>
    </>
  )
}

AreaChart.defaultProps = {
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
}
