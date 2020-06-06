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

export const makeFilteredData = data => {
  const filteredData = data
    .filter(d => !!d.release_date && !!d.vote_count)
    .sort((a, b) => b.vote_count - a.vote_count)
  return filteredData
}
