import React from 'react';
import { FlexContainer, GridContainer} from '../atoms'

export default function(){

  return (
    <FlexContainer
      fullScreen
    >
      <GridContainer
        width="95%"
        maxWidth="1440"
        minWidth="1100"
        height="95%"
        maxHeight="720"
        minHeight="600"  
        borderColor="red"
      >

      </GridContainer>
    </FlexContainer>
  )
}