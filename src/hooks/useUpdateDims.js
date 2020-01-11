import { useEffect } from "react";
import { usePrevious } from ".";

export default function useDimsUpdate({
  updateDims, init, width, height
}){
  console.log(init, width, height)
  const prevWidth = usePrevious(width)
  const prevHeight = usePrevious(height)
  useEffect(() => {
    if (!!init && (prevWidth !== width || prevHeight !== height)) {
      updateDims();
    }
  }, [height, init, prevHeight, prevWidth, updateDims, width]);
}