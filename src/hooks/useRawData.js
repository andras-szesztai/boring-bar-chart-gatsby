import { useEffect, useState } from "react"


export default function useRawData(node){
  const [ rawData, setRawData ] = useState(undefined)
  useEffect(() => {
    if(!rawData && node){
      setRawData(node[0].data)
    }
  }, [rawData, node])

  return rawData
}