import { useRef } from "react"


export default function useInitValues(
  values
){
  const initValues = useRef({...values})
  return initValues
}