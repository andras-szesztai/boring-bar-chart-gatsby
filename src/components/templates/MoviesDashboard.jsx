import React from 'react'
import { useDeviceType } from '../../hooks'
import { Helmet } from 'react-helmet'

export default function MoviesDashboard() {

  const device = useDeviceType()
  return (
    <>
      <Helmet title="Dashboard under construction" />
      {device === "desktop" && <div>Dashboard</div>}
    </>
  )
}
