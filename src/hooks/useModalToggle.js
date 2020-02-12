import { useEffect, useState } from "react"


export default function useModalToggle(){
  const [ shouldModalToggle, setShouldModalToggle ] = useState(false)
  useEffect(() => {
    if(shouldModalToggle){
      setShouldModalToggle(false)
    }
  },[shouldModalToggle])
  return { shouldModalToggle, setShouldModalToggle }
}