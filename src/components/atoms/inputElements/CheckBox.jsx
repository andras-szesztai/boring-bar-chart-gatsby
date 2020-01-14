import React from "react"
import styled from "styled-components"

export default function({
  checked,
  label,
  value
}) {
  return (
    <label htmlFor={value}>
      <input
        id={value}
        type="checkbox"
        value={value}
        checked={checked}
      />
      {
        label &&
        <span>{label}</span>
      }
    </label>
  )
}
