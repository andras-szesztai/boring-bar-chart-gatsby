import { useState, useEffect } from "react";

import usePrevious from "./usePrevious";


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
