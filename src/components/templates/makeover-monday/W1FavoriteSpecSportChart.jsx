import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { scaleLinear } from "d3-scale"
import { axisBottom } from "d3-axis"
import { select } from "d3-selection"
import { max, min } from "d3-array"
import { PropagateLoader } from "react-spinners"
import Image from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"

import { VerticalDropChartRow } from "../../organisms"
import { getAxisPadding } from "../../../utils"
import {
  FlexContainer,
  ChartSvg,
  Title,
  NeumorphButton,
  ChartArea as AxisArea,
  ColoredSpan,
} from "../../atoms"
import { themifyFontSize } from "../../../themes/mixins"
import { useDimensions, useDimsUpdate } from "../../../hooks"
import Credits from "../../molecules/Credits"
import { GridContainer, Container } from "../../atoms/containers"

const ChartContainer = styled.div`
  position: relative;

  width: 80vw;
  min-width: 800px;
  max-width: 1100px;

  height: 80vh;
  max-height: 600px;
  min-height: 500px;

  display: grid;
  grid-template-rows: repeat(10, 1fr);
  grid-row-gap: 1rem;

  text {
    font-size: ${themifyFontSize(1)};
  }
`

const ImageContainer = styled(Container)`
  position: relative;
  width: 135px;
`

const axisSvgHeight = 12

const flexEndObject = { justify: "flex-end" }
const creditElements = [
  {
    ...flexEndObject,
    text: "Designed and built by",
    link: "https://twitter.com/AndSzesztai",
    anchorText: "András Szesztai",
  },
  {
    ...flexEndObject,
    text: "Project",
    link: "https://www.makeovermonday.co.uk/",
    anchorText: "#MakeoverMonday",
  },
  {
    ...flexEndObject,
    text: "Data source",
    link: "https://news.gallup.com/poll/4735/sports.aspx#1",
    anchorText: "Gallup",
  },
]

const chartColors = {
  text: "#191919",
  bg: "#E5E5E5",
  neu: "#999999",
  lgGrowth: "#2A638C",
  lgDecline: "#CC603D",
}

const margin = {
  top: 0,
  right: 15,
  bottom: 0,
  left: 15,
}

export default function({ rawData, data, valueArray }) {
  const query = useStaticQuery(graphql`
      {
        allContentfulImages(filter: {contentful_id: {eq: "1aC8EITLwvaOOpttIMNamr"}}) {
          nodes {
            images {
              fluid {
                ...GatsbyContentfulFluid_tracedSVG
              }
            }
          }
        }
      }
  `)

  const [domain, setDomain] = useState(undefined)
  useEffect(() => {
    if (rawData && !domain) {
      const params = [rawData, "perc", 0.025]
      setDomain([
        min(rawData, d => d.perc) - getAxisPadding(...params),
        max(rawData, d => d.perc) + getAxisPadding(...params),
      ])
    }
  }, [domain, rawData])

  const svgRef = useRef()
  const axisRef = useRef()
  const wrapperRef = useRef()
  const { width, height } = useDimensions({ ref: wrapperRef })
  const [axisInit, setAxisInit] = useState(false)
  function createUpdateAxis() {
    const axis = axisBottom(
      scaleLinear()
        .domain(domain)
        .range([0, svgRef.current.clientWidth - margin.left - margin.right])
    )
      .tickSize(0)
      .ticks(3)
      .tickFormat(d => d + "%")
    select(axisRef.current).call(axis)
    select(axisRef.current)
      .select(".domain")
      .remove()
    setAxisInit(true)
  }
  useEffect(() => {
    if (svgRef && svgRef.current && width && !axisInit) {
      createUpdateAxis()
    }
  })

  function updateDims() {
    createUpdateAxis()
  }
  useDimsUpdate({ updateDims, init: true, width, height })

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 2000)
    }
  })

  const [buttons, setButtons] = useState({
    "2008": { text: 2008, checked: false },
    "2017": { text: 2017, checked: false },
  })

  return (
    <>
      {loading && (
        <FlexContainer
          fullScreen
          absPos
          bgColor={chartColors.bg}
          fontColor="grayDarkest"
          zIndex="loader"
        >
          <PropagateLoader
            size={10}
            color={chartColors.neu}
            loading={loading}
          />
        </FlexContainer>
      )}
      <FlexContainer
        fullScreen
        bgColor={chartColors.bg}
        fontColor="grayDarkest"
      >
        <ChartContainer ref={wrapperRef}>
          {valueArray &&
            valueArray.map(val => (
              <VerticalDropChartRow
                colors={chartColors}
                displayedYears={Object.values(buttons)}
                axisLabel={val}
                key={val}
                data={data[val]}
                domain={domain}
                margin={margin}
                parentRef={wrapperRef}
              />
            ))}
          <ChartSvg
            absPos
            top={height / 2 - axisSvgHeight / 2}
            left={margin.left}
            ref={svgRef}
            width={width}
            height={axisSvgHeight}
            fontSize={1}
            fontColor="grayLight"
            visible={Object.values(buttons)
              .map(val => val.checked)
              .includes(false)}
          >
            <AxisArea ref={axisRef} marginLeft={margin.left} />
          </ChartSvg>
          <FlexContainer
            absPos
            top={height / 2 - height * 0.31}
            right={0}
            width="420px"
            textAlign="right"
          >
            <div>
              Compared to 2008, a growing number of Americans chose
              <ColoredSpan color={chartColors.lgGrowth} fontWeight={5}>
                {" "}
                Soccer{" "}
              </ColoredSpan>
              as their favorite sport to watch in 2017, while the popularity of
              <ColoredSpan color={chartColors.lgDecline} fontWeight={5}>
                {" "}
                Football{" "}
              </ColoredSpan>
              seems to be on the decline.
            </div>
          </FlexContainer>
          <FlexContainer
            fixSize
            height="100px"
            justify="flex-end"
            align="flex-end"
            direction="column"
            whiteSpace="no-wrap"
            paddingBottom={1}
            absPos
            bottom={height / 2 + axisSvgHeight / 1.5}
            right={0}
          >
            <Title fontSize={1} color="grayLight">
              Changes between 2008 and 2017
            </Title>
            <Title fontSize={5} fontWeight={0} color="grayDarkest">
              Top Spectator Sports in the United States
            </Title>
          </FlexContainer>
          <FlexContainer
            fixSize
            height="55px"
            width="210px"
            justify="space-around"
            absPos
            top={height / 2 + axisSvgHeight / 2}
            right={0}
          >
            {Object.values(buttons).map(b => (
              <NeumorphButton
                key={b.text}
                height={30}
                width={60}
                {...b}
                handleClick={() =>
                  setButtons(prev => ({
                    ...prev,
                    [b.text]: {
                      ...prev[b.text],
                      checked: !prev[b.text].checked,
                    },
                  }))
                }
              />
            ))}
          </FlexContainer>
          <FlexContainer absPos top={height / 2 + height * 0.21} right={0}>
            <GridContainer
              columns="1fr min-content 1fr"
              width="200px"
              columnGap={0.5}
            >
              <FlexContainer>2008</FlexContainer>
              <ImageContainer>
              {console.log(query)}
                <Image
                  fluid={
                    query.allContentfulImages.nodes[0].images[0].fluid
                  }
                />
              </ImageContainer>
              <FlexContainer>2017</FlexContainer>
            </GridContainer>
          </FlexContainer>
          <Credits
            direction="column"
            position={{
              bottom: 0,
              right: 0,
            }}
            elements={creditElements}
          />
        </ChartContainer>
      </FlexContainer>
    </>
  )
}
