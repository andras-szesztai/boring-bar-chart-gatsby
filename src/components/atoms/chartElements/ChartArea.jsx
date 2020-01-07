import React from 'react';
import styled from 'styled-components'

export const ChartArea = styled.g`
  transform: translate(
    ${props => props.marginLeft}px,
    ${props => props.marginTop}px
  );
`;

export default function(props){

  return (
    <ChartArea {...props}>
      {props.children}
    </ChartArea>
  )
}

