import React from 'react';
import CountUp from "react-countup"

import { Title } from "../../atoms"
import { transition } from '../../../themes/theme';

const { mdNum } = transition

export default function CountUpSpan({
  decimals,
  value,
  duration,
  ...otherProps
}){
  
  return (
    <Title {...otherProps}>
      <CountUp
        end={value}
        preserveValue={true}
        decimals={decimals}
        duration={duration}
      />
    </Title>
  )
}

CountUpSpan.defaultProps = {
  decimals: 0,
  duration: mdNum/1000
}