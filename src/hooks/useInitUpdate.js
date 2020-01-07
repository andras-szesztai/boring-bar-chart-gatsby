import { useState, useEffect } from "react";
import _ from "lodash";

import usePrevious from "./usePrevious";

function checkIfUpdated(sortedRaw, sortedPrevRaw) {
  return sortedRaw
    .map((el, i) => _.isEqual(el, sortedPrevRaw[i]))
    .includes(false);
}

export default function useInitUpdate({
  data,
  chartHeight, chartWidth,
  initVis,
  updateVis
}) {
  const [state, setState] = useState({
    init: false,
    runUpdate: false
  });

  const { init, runUpdate } = state

  useEffect(() => {
    if(!init && chartHeight && chartWidth && data){
      setState(prev => ({...prev, init: true}))
      initVis()
    }

  }, [chartHeight, chartWidth, data, init, initVis])

  return state;
}
