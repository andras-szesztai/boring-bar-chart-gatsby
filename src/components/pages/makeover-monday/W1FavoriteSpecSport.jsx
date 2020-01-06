import React, { useEffect, useState } from 'react';
import { useStaticQuery, graphql } from "gatsby"

export default function Dashboard(){


  const { allStrapiDatasets: { nodes } } = useStaticQuery(graphql`
  {
    allStrapiDatasets(filter: {name: {}}) {
      nodes {
        data {
          Sport
          perc
          year
        }
        Description
      }
    }
  }`)

  const [ rawData, setRawData ] = useState(undefined)
  useEffect(() => {
    if(!rawData && nodes){
      setRawData(nodes[0].data)
    }
  }, [rawData, nodes])

  return (
    <div>
      Week One
    </div>
  )
}