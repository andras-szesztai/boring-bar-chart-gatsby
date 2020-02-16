
export const COLOR_RANGE = ["#fc5050", "#FCD432", "#415f77"]

export const SYNCED_CHECKBOXES = ["elo", "moves"]

export const CAROUSEL_PAGES = [
  "Bio",
  "Number of Games in Dataset",
  "Average ELO Score",
  "Maximum ELO Score",
]

const flexEndObject = { justify: "flex-start" }

export const CREDIT_ELEMENTS = [
  {
    ...flexEndObject,
    text: "Designed and built by",
    link: "https://twitter.com/AndSzesztai",
    anchorText: "András Szesztai",
  },
  {
    ...flexEndObject,
    text: "Project",
    link: "https://www.boringbarchart.com/",
    anchorText: "BoringBarChart",
  },
  {
    ...flexEndObject,
    text: "Data source",
    link: "https://www.chess.com/games",
    anchorText: "chess.com",
  },
  {
    ...flexEndObject,
    text: "Box plot explanation & image",
    link: "https://towardsdatascience.com/understanding-boxplots-5e2df7bcbd51",
    anchorText: "towards data science",
  },
]

export const BOX_PLOT_EXPLAIN = [
  {
    title: "Median (Q2/50th Percentile)",
    text: "the middle value of the dataset",
  },
  {
    title: "First quartile (Q1/25th Percentile)",
    text:
      "the middle number between the smallest number (not the “minimum”) and the median.",
  },
  {
    title: "Third quartile (Q3/75th Percentile)",
    text:
      "the middle value between the median and the highest value (not the “maximum”).",
  },
  { title: "Interquartile range (IQR)", text: "25th to the 75th percentile." },
  { title: "Maximum | Minimum", text: "Q3 + 1.5*IQR | Q1 -1.5*IQR" },
]
