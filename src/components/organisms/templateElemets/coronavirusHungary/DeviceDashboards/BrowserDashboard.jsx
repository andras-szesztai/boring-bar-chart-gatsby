import React, { useState, useEffect } from "react"
import styled from "styled-components"
import {
  MobileOnlyView,
  TabletView,
  BrowserView,
  withOrientationChange,
} from "react-device-detect"
import { format, differenceInDays, subDays } from "date-fns"
import numeral from "numeral"
import _ from "lodash"
import Slider from "@material-ui/core/Slider"
import { withStyles } from "@material-ui/core/styles"
import { GoPrimitiveSquare, GoTools } from "react-icons/go"
import Switch from "react-switch"
import CountUp from "react-countup"

import { GridContainer } from "../../../../atoms"
import { space } from "../../../../../themes/theme"

const BrowserMainGrid = styled(GridContainer)`
  max-width: 1400px;
  width: 95vw;

  max-height: 700px;
  min-height: 500px;
  height: 95vh;

  grid-template-columns: repeat(10, 5fr);
  grid-template-rows: min-content repeat(10, 1fr);
  grid-row-gap: ${space[1]}px;
  grid-column-gap: ${space[1]}px;
  grid-template-areas:
    "title title title title title title source source source source"
    "total tNum date date date date slider slider slider slider"
    "no noNum barC barC barC barC percText percText percText percText"
    "no noNum barC barC barC barC percNo percNo percFfi percFfi"
    "ffi ffiNum barC barC barC barC percBar percBar percBar percBar"
    "ffi ffiNum barC barC barC barC percBar percBar percBar percBar";
`

export default BrowserDashboard(){

  return <BrowserMainGrid></BrowserMainGrid>
}