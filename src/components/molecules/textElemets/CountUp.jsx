import React, { useState, useEffect } from 'react';
import CountUp from "react-countup"

import { Title } from "../../atoms"
import { transition } from '../../../themes/theme';
import { usePrevious } from '../../../hooks';

const { mdNum } = transition

export default function CountUpSpan({
  decimals,
  value,
  ...otherProps
}){

  const prevValue = usePrevious(value)
  const [ state, setState  ] = useState(undefined)
  useEffect(() => {
    if(!state){
      setState(value)
    }
  }, [state, value])

  console.log(state);
  
  return (
    <Title {...otherProps}>
      <CountUp
        end={value}
        preserveValue={true}
        decimals={decimals}
        duration={mdNum/1000}
      />
    </Title>
  )
}

CountUpSpan.defaultProps = {
  decimals: 0
}