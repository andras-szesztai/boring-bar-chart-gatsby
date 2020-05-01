import React from "react"
import { Helmet } from "react-helmet"
import { HierarchicalMultiSelect } from "../../../components/molecules"

const data = [
  {
    region: "Africa",
    countries: [
      { name: "Algeria" },
      { name: "Congo" },
      { name: " Morocco" },
      { name: " Tunisia" },
    ],
  },
  {
    region: "Europe",
    countries: [
      { name: " Austria" },
      { name: " France" },
      { name: " Germany" },
      { name: "Hungary" },
      { name: " Italy" },
      { name: "Netherlands" },
    ],
  },
  {
    region: "North America",
    countries: [{ name: "Canada" }, { name: "United States" }],
  },
  {
    region: "Asia",
    countries: [
      { name: "Afghanistan" },
      { name: "China" },
      { name: "India" },
      { name: " Japan" },
      { name: " South Korea" },
    ],
  },
]

export default function() {
  return (
    <>
      <Helmet title="Hierarchical Multi Select" />
      <HierarchicalMultiSelect data={data} />
    </>
  )
}
