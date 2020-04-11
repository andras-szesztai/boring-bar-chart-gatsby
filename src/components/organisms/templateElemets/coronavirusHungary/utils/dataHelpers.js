import _ from "lodash"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"

export const makeAreaData = (data, fullList) => {
  const grouped = _.groupBy(data, "age")
  const newData = fullList.map(age => ({
    age: +age,
    number: grouped[age] ? grouped[age].length : 0,
  }))
  return newData
}

export const filterGender = ({ accessor, data, language }) =>
  data.filter(({ gender }) => gender === TEXT[accessor][language])
