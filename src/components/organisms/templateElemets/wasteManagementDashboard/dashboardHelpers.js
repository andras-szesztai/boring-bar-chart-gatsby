const makeDate = num => new Date(num,1,1)
export function getAbsData(data) {
  return data.map(el => ({
    ...el,
    recycling_composting: +el.recycling_composting,
    recycling_material: +el.recycling_material,
    recycling_total: +el.recycling_composting + +el.recycling_material,
    waste: +el.waste,
    yearString: el.year,
    year: makeDate(+el.year),
  }))
}

export function getPercentageData(data) {
  return data.map(el => {
    return {
      ...el,
      recycling_composting: +el.recycling_composting / +el.waste,
      recycling_material: +el.recycling_material / +el.waste,
      recycling_total:
        (+el.recycling_material + +el.recycling_composting) / +el.waste,
      waste: 1,
      yearString: el.year,
      year: makeDate(+el.year),
    }
  })
}
