import React from "react";
import { colors } from "../../../../themes/theme";

export default function AxisLine(props) {
  return <line style={{ stroke: colors[props.color] || colors.gray }} {...props} />;
}
