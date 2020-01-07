import React from 'react';
import styled from 'styled-components'

export const ChartWrapper = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  width: 100%;
`;

export default function(props){

  return (
    <ChartWrapper {...props}>
      {props.children}
    </ChartWrapper>
  )
}