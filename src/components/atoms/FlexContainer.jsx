import React from 'react';
import styled from 'styled-components'

const Container = styled.div`
  font-size: ${props => console.log(props)}
`


export default function FlexContainer({
  children
}){

  return (
    <Container>
      {children}
    </Container>
  )
}

FlexContainer.defaultProps = {

}