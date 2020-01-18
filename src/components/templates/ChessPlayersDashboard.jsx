import React, { useState, useEffect } from "react"

import { FlexContainer, GridContainer, CheckBox, SelectAllText } from "../atoms"
import { SortableComponent } from "../molecules"
import { ParallelBoxPlotColumn } from "../organisms"

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
  console.log(data);
  


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
                <GridContainer rows="repeat(2, 1fr)" rowGap={.5}>
                  <FlexContainer borderColor="gray"/>
                  <FlexContainer borderColor="gray"/>
                </GridContainer>
              <FlexContainer
                borderColor="gray"
                direction="column"
                justify="space-evenly"
              >
                <FlexContainer>LDW Select</FlexContainer>
                {
                  checkedObject &&
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
                }
              </FlexContainer>
            </GridContainer>
            <FlexContainer borderColor="gray">Brush Control</FlexContainer>
          </GridContainer>
        </GridContainer>
        <GridContainer rows="1fr 50px">
          {checkedObject && (
            <SortableComponent
              axis="x"
              lockAxis="x"
              // useDragHandle
              columnGap={0.5}
              fullSize
              columns="repeat(8, 1fr)"
              items={dataKeys.map(d => (
                <GridContainer rows="150px 1fr 100px" key={d} fullSize>
                  <FlexContainer borderColor="gray">Bio</FlexContainer>
                  <ParallelBoxPlotColumn/>
                  <FlexContainer
                    borderColor="gray"
                    direction="column"
                    justify="space-evenly"
                  >
                    <FlexContainer>LDW</FlexContainer>
                    <CheckBox
                      parentChecked
                      checked={checkedObject[d]}
                      test={checkedObject}
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
