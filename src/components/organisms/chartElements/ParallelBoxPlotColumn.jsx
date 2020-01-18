import React from 'react';
import { GridContainer, FlexContainer } from '../../atoms';

export default function ParellelBoxPlotColumn({
 data, isFiltered, result, period
}){
  console.log(data);
  console.log(isFiltered);

  return (
    <GridContainer
      rows="repeat(2, 1fr)"
      columns="repeat(2, 1fr)"
      rowGap={.5}
      columnGap={.5}
    >
      <FlexContainer borderColor="gray"/>
      <FlexContainer borderColor="gray"/>
      <FlexContainer borderColor="gray"/>
      <FlexContainer borderColor="gray"/>
    </GridContainer>
  )
}