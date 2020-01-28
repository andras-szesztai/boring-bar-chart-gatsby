import React from "react"
import _ from "lodash"

export default function useArrayRefs() {
  const refs = React.useRef(_.map(new Array(8), () => React.createRef()))
  return refs
}
