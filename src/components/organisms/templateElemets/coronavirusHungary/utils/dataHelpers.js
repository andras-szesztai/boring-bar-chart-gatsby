import _ from "lodash"

export const makeAreaData = (data, fullList) => {
  const grouped = _.groupBy(data, "age")
  const newData = fullList.map(age => ({
    age: +age,
    number: grouped[age] ? grouped[age].length : 0,
  }))
  return newData
}