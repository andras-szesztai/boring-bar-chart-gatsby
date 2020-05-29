import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`

const ChartSvg = styled.svg`
  height: 100%;
  width: 100%;
`

export default function BubbleChart({data}) {
  return (
    <Wrapper>
      <ChartSvg/>
    </Wrapper>
  )
}
