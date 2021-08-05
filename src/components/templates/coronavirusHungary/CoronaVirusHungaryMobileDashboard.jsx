import React from "react"
import { useWindowSize } from "@react-hook/window-size"
import styled from "styled-components"
import { MdTranslate } from "react-icons/md"
import { GoCalendar } from "react-icons/go"

import { FlexContainer } from "../../atoms"
import { space } from "../../../themes/theme"

const MobileFilterContainer = styled.div`
  position: absolute;
  bottom: ${space[3]}px;
  left: ${space[3]}px;

  display: flex;
  justify-content: space-evenly;

  height: 50px;
  width: calc(100vw - ${2 * space[3]}px);
  border-radius: ${space[1]}px;

  background-color: #fff;
  border: 1px solid #333;
`

export default function Dashboard({ data, loading }) {
  const [width, height] = useWindowSize()

  return (
    <>
      {width && (
        <FlexContainer
          pos="relative"
          height={`${height}px`}
          width={`${width}px`}
        >
          <MobileFilterContainer>
            <FlexContainer>
              <GoCalendar size={25} />
            </FlexContainer>
            <FlexContainer>
              <MdTranslate size={25} />
            </FlexContainer>
          </MobileFilterContainer>
        </FlexContainer>
      )}
    </>
  )
}
