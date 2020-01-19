import React, { useRef } from 'react';
import { ChartSvg, FlexContainer } from '../../atoms';
import { useDimensions } from '../../../hooks';

export default function HorizontalStackedBarChart({
  data
}) {
  const wrapperRef = useRef()
  const svgRef = useRef()
  const { width, height } = useDimensions({ref: wrapperRef})
  console.log(width, height);
  
  function initVis(){
    
  }
  function updateVis(){

  }
  function updateDims(){

  }

  return (
    <FlexContainer fullSize ref={wrapperRef}>
      <ChartSvg ref={svgRef} />
    </FlexContainer>
  )
}