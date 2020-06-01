import React from 'react'

import { usePrevious } from '..'

export default function useStateWithPrevious(initial) {
  const [ state, setState ] = React.useState(initial)
  const prevState = usePrevious(state)
  return [ state, setState, prevState ]
}
