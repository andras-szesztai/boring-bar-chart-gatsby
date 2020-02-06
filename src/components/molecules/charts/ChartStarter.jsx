import React from 'react';
import { FlexContainer, ChartSvg, ChartArea } from '../../atoms';

export default function({ refs, dims, margin }){
  const { wrapperRef, svgRef, areaRef } = refs;
  const { height, width} = dims;
  const { left, top} = margin;

  return (
    <FlexContainer pos="relative" fullSize ref={wrapperRef}>
    <ChartSvg absPos ref={svgRef} width={width} height={height}>
      <ChartArea
        ref={areaRef}
        marginLeft={left}
        marginTop={top}
      />
    </ChartSvg>
  </FlexContainer>
  )
}