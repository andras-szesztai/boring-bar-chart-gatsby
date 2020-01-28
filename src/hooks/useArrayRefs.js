import React from "react"
import _ from "lodash"

export default function useArrayRefs(num) {
  const refs = React.useRef(_.map(new Array(num), () => React.createRef()))
  return refs
}
