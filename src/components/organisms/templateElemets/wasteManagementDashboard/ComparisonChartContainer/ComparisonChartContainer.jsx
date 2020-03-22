import React from 'react';
import { GridContainer, FlexContainer } from '../../../../atoms';
import AreaChart from '../AreaChart/AreaChart';

export default function ComparisonChartContainer({
  selectedCountry,
  data,
  metric
}) {

  console.log(data);
  
  return <GridContainer rows="30px 1fr" gridArea="chartTwo" withBorder>
    <FlexContainer>Selector</FlexContainer>
    {!selectedCountry ? (
      <FlexContainer>Explainer</FlexContainer>
    ) : (
      <FlexContainer>
        <AreaChart data={data} metric={metric} value={selectedCountry} withAxes/>
      </FlexContainer>
    )}
  </GridContainer>
}
