import React from "react"
import { colors } from "../../../../themes/theme"

export default function AxisLine(props) {
  return (
    <line
      style={{
        stroke: colors[props.color] || colors.gray,
        strokeWidth: props.stroke || 1,
      }}
      ref={props.areaRef}
      y1={props.y1}
      y2={props.y2}
      x1={props.x1}
      x2={props.x2}
    />
  )
}
