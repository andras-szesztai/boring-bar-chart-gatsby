import React from "react"
import CountUp from "react-countup"
import numeral from "numeral"

const Number = props => (
  <CountUp
    end={props.num}
    duration={1}
    preserveValue
    formattingFn={val =>
      props.isPercentage ? numeral(val).format("0.0%") : val
    }
    decimals={props.isPercentage && 3}
  />
)

export default Number
