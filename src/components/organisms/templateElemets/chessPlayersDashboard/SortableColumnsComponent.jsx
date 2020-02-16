import React from "react"
import Image from "gatsby-image"

import { SortableComponent, CountUpSpan } from "../../../molecules"
import { GridContainer, Container, FlexContainer, CheckBox, SortableHandle } from "../../../atoms"
import { useArrayRefs } from "../../../../hooks"
import { ParallelBoxPlotColumn, HorizontalStackedBarChartContainer } from "../../chartElements"
import { COLOR_RANGE } from "../../../../constants/chessPlayersDashboard"

export default function SortableColumnsComponent({
  setShouldTooltipClose,
  dataKeys,
  data,
  sumMetrics,
  checkedObject,
  setMouseOver,
  mouseOver,
  mouseOverValue,
  setHoveredElementTop,
  setHoveredElementBottom,
  dataSets,
  syncObject,
  resultCheckedObject,
  setCheckedObject
}) {

  const infoContainerRefs = useArrayRefs(data.length)
  const barContainerRefs = useArrayRefs(data.length)

  return (
    <SortableComponent
      axis="x"
      lockAxis="x"
      columnGap={8}
      fullSize
      useDragHandle
      onSortStart={() => setShouldTooltipClose(true)}
      onSortEnd={() => setShouldTooltipClose(false)}
      columns="repeat(6, 1fr)"
      items={dataKeys.map((d, i) => {
        const dataSet = data.find(({ nameId }) => nameId === d)
        const keySumMetrics = sumMetrics && sumMetrics[d]
        const isChecked = checkedObject[d]
        return (
          <GridContainer
            rows="180px 1fr 100px"
            key={d}
            fullSize
            onMouseEnter={() => {
              setMouseOver(d)
              mouseOverValue.current = d
            }}
            onMouseLeave={() => setMouseOver(undefined)}
          >
            <GridContainer
              ref={infoContainerRefs.current[i]}
              noGap
              fullSize
              rows="repeat(2, 1fr)"
              onMouseEnter={() =>
                setHoveredElementTop(infoContainerRefs.current[i])
              }
              onMouseLeave={() => setHoveredElementTop(undefined)}
            >
              <GridContainer noGap columns="70% 30%">
                <Container pos="relative">
                  <Image
                    style={{ maxHeight: 90, borderRadius: 2 }}
                    fluid={dataSet.image.fluid}
                  />
                </Container>
                <FlexContainer
                  visibility={mouseOver === d ? "visible" : "hidden"}
                >
                  <SortableHandle size={15} horizontal align="flex-start" />
                </FlexContainer>
              </GridContainer>
              <GridContainer
                noGap
                rows="repeat(4, 1fr)"
                paddingLeft={1}
                paddingRight={1}
              >
                {keySumMetrics && (
                  <>
                    <FlexContainer justify="flex-start" fontWeight={3}>
                      {dataSet.fullName}
                    </FlexContainer>
                    <FlexContainer justify="space-between">
                      <span>No. of games:</span>
                      <CountUpSpan value={+keySumMetrics.noOfGames} />
                    </FlexContainer>
                    <FlexContainer justify="space-between">
                      <span>Avg. ELO:</span>
                      <CountUpSpan value={+keySumMetrics.avgElo} />
                    </FlexContainer>
                    <FlexContainer justify="space-between">
                      <span>Max. ELO:</span>
                      <CountUpSpan value={+keySumMetrics.maxElo} />
                    </FlexContainer>
                  </>
                )}
              </GridContainer>
            </GridContainer>
            <ParallelBoxPlotColumn
              data={dataSets[d]}
              syncObject={syncObject}
              eloRange={dataSets.eloRange}
              movesRange={dataSets.movesRange}
              isResultsFiltered={Object.values(resultCheckedObject).includes(
                false
              )}
              isChecked={isChecked}
            />
            <GridContainer
              ref={barContainerRefs.current[i]}
              rows="repeat(2, 50%)"
              rowGap={0}
            >
              <FlexContainer
                direction="column"
                onMouseEnter={() =>
                  setHoveredElementBottom(barContainerRefs.current[i])
                }
                onMouseLeave={() => setHoveredElementBottom(undefined)}
              >
                <HorizontalStackedBarChartContainer
                  isFiltered={isChecked}
                  colorRange={COLOR_RANGE}
                  results={resultCheckedObject}
                  data={dataSets[d]}
                />
              </FlexContainer>
              <FlexContainer>
                <CheckBox
                  parentChecked
                  checked={isChecked}
                  value={d}
                  onClick={() => {
                    setCheckedObject(prev => ({
                      ...prev,
                      [d]: !prev[d],
                    }))
                  }}
                />
              </FlexContainer>
            </GridContainer>
          </GridContainer>
        )
      })}
    />
  )
}
