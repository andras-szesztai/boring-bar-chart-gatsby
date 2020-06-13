import { groupBy, uniqBy } from "lodash"

export const makeUniqData = (data, type) => {
  const jobs = data.map(el => ({
    id: el.id,
    job: el[type === "cast" ? "character" : "job"],
  }))
  const groupped = groupBy(jobs, "id")
  const uniq = uniqBy(data, "id")
  const enrichedUniq = uniq.map(el => ({
    ...el,
    job: groupped[el.id].map(d => d.job),
  }))
  return enrichedUniq
}

export const makeFilteredData = (data, type) => {
  const accessor = type === "cast" ? "character" : "job"
  const ceremonies = [
    "The Academy Awards",
    "Tony Awards",
    "Saturday Night Live",
    "MTV Video Music Awards",
    "Kids' Choice Awards",
    "Great Performances",
    "Today",
    "Fantastic",
    "Good Morning America",
    "CBS News Sunday Morning",
    "Critics' Choice Movie Awards",
    "The Graham Norton Show",
    "The Bill Engvall Show",
  ]
  const filteredData = data
    .filter(
      d =>
        (!!d.release_date || !!d.first_air_date) &&
        !!d.vote_count &&
        !!d.vote_average &&
        d.vote_average !== 10 &&
        !!d[accessor] &&
        !ceremonies.includes(d.title || d.name) &&
        (d.character
          ? !d.character.toLowerCase().includes("himself") &&
            !d.character.toLowerCase().includes("archive")
          : true)
    )
    .map(d => ({
      ...d,
      unified_date: d.release_date || d.first_air_date,
      unified_year: (d.release_date || d.first_air_date).slice(0, 4),
    }))
    .sort((a, b) => b.vote_count - a.vote_count)
  return filteredData
}
