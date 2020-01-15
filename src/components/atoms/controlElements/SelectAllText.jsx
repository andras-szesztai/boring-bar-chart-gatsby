import React from "react"
import { Container } from "../containers"

export default function({
  array, handleClick
}){


  const isMissing = array.includes(false)
  return (
    <Container
      fontWeight={3}
      cursor="pointer"
      onClick={() => handleClick(isMissing)}
    >
      {isMissing ? "Select all" : "Unselect all"}
    </Container>
  )
}

