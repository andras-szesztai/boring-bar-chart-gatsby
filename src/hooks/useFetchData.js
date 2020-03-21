import { useState, useEffect } from "react"
import { json } from "d3-fetch"

export default function useDataFetch(url) {
  const [response, setResponse] = useState(undefined)
  useEffect(() => {
    if (!response) {
      console.log(url);
      
      json(url).then(res => {
        console.log(res);
        setResponse(res)
      })
    }
  }, [response, url])
  
  return response
}
