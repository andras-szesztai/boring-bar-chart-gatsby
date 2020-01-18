import React, { useState, useEffect } from "react"

import { FlexContainer, GridContainer, CheckBox, SelectAllText } from "../atoms"
import { SortableComponent } from "../molecules"
import { ParallelBoxPlotColumn } from "../organisms"
import VerticalMultiSelect from "../molecules/controlElements/VerticalMultiSelect"

function checkUncheckAll(bool, keys) {
  let checkArray = {}
  keys.forEach(key => (checkArray = { ...checkArray, [key]: bool }))
  return checkArray
}

export default function({ data }) {
  const [dataKeys, setDataKeys] = useState(undefined)
  useEffect(() => {
    if (!dataKeys) {
      setDataKeys(data.map(({ nameId }) => nameId))
    }
  }, [dataKeys, data])

  const [checkedObject, setCheckedObject] = useState(undefined)
  useEffect(() => {
    if (dataKeys && !checkedObject) {
      setCheckedObject(checkUncheckAll(true, dataKeys))
    }
  }, [dataKeys, data, checkedObject])

  const [resultCheckedObject, setResultCheckedObject] = useState({
    Lose: true,
    Draw: true,
    Win: true,
  })

  return (
    <FlexContainer fullScreen>
      <GridContainer
        width="95%"
        maxWidth="1440"
        minWidth="1100"
        height="95%"
        maxHeight="720"
        minHeight="600"
        columns="200px 1fr"
      >
        <GridContainer rows="150px 1fr">
          <FlexContainer borderColor="gray">Title</FlexContainer>
          <GridContainer rows="1fr 50px">
            <GridContainer rows="1fr 100px">
              <GridContainer rows="repeat(2, 1fr)" rowGap={0.5}>
                <FlexContainer borderColor="gray" />
                <FlexContainer borderColor="gray" />
              </GridContainer>
              <GridContainer
                borderColor="gray"
                rows="repeat(2, 50%)"
                rowGap={0}
              >
                <FlexContainer>
                  <VerticalMultiSelect
                    values={["Lose", "Draw", "Win"]}
                    colorRange={["#fc5050", "#ffd00c", "#415f77"]}
                    checkedObject={resultCheckedObject}
                    handleClick={val =>
                      setResultCheckedObject(prev => ({
                        ...prev,
                        [val]: !prev[val],
                      }))
                    }
                  />
                </FlexContainer>
                <FlexContainer>
                  {checkedObject && (
                    <SelectAllText
                      handleClick={isMissing => {
                        setCheckedObject(
                          isMissing
                            ? checkUncheckAll(true, dataKeys)
                            : checkUncheckAll(false, dataKeys)
                        )
                      }}
                      array={Object.values(checkedObject)}
                    />
                  )}
                </FlexContainer>
              </GridContainer>
            </GridContainer>
            <FlexContainer borderColor="gray">Brush Control</FlexContainer>
          </GridContainer>
        </GridContainer>
        <GridContainer rows="1fr 50px">
          {checkedObject && (
            <SortableComponent
              axis="x"
              lockAxis="x"
              columnGap={0.5}
              fullSize
              columns="repeat(8, 1fr)"
              items={dataKeys.map(d => (
                <GridContainer rows="150px 1fr 100px" key={d} fullSize>
                  <FlexContainer borderColor="gray">Bio</FlexContainer>
                  <ParallelBoxPlotColumn
                    data={data.find(({ nameId }) => nameId === d)}
                    isFiltered={checkedObject[d]}
                    results={Object.keys(resultCheckedObject).filter(key => resultCheckedObject[key])}
                  />
                  <FlexContainer
                    borderColor="gray"
                    direction="column"
                    justify="space-evenly"
                  >
                    <FlexContainer>LDW</FlexContainer>
                    <CheckBox
                      parentChecked
                      checked={checkedObject[d]}
                      value={d}
                      onClick={() =>
                        setCheckedObject(prev => ({ ...prev, [d]: !prev[d] }))
                      }
                    />
                  </FlexContainer>
                </GridContainer>
              ))}
            />
          )}
          <FlexContainer borderColor="gray">Filters</FlexContainer>
        </GridContainer>
      </GridContainer>
    </FlexContainer>
  )
}
