const COUNTRY_ORDER = [
  "Finland",
  "Norway",
  "Sweden",
  "Denmark",
  "Britain",
  "Ireland",
  "Netherlands",
  "Germany",
  "Belgium",
  "Austria",
  "France",
  "Italy",
  "Spain",
  "Portugal",
  "Greece",
]

const COLOR_RANGE = ["#ef6c7f", "#e6e1e8", "#66768e", "#415f77"]
const COLOR_DOMAIN = [-0.2, 0, 0.2, 0.4]
const OFFSET_RANGE = ["0%", "33.3%", "66.6%", "100%"]
const LEGEND_END_TEXTS = ["Less Trust", "More Trust"]

const CREDIT_ELEMENTS = [
  {
    justify: "left",
    text: "Built by",
    link: "https://twitter.com/AndSzesztai",
    anchorText: "András Szesztai",
  },
  {
    justify: "center",
    text: "Original design & article",
    link:
      "https://www.economist.com/graphic-detail/2020/02/15/analysts-stock-recommendations-are-coloured-by-their-cultural-biases",
    anchorText: "The Economist",
  },
  {
    justify: "flex-end",
    text: "",
    link: "https://editorialexpress.com/cgi-bin/conference/download.cgi?db_name=ESWM2019&paper_id=201",
    anchorText: "Data source",
  },
]

const GRAPH_URL =
  "https://www.economist.com/graphic-detail/2020/02/15/analysts-stock-recommendations-are-coloured-by-their-cultural-biases"

const DATASET_URL =
  "https://boring-barchart-gatsby.firebaseio.com/trustBiases.json"

const TEXTS = {
  TITLE: "Trust Biases* between European Nations",
  EXPLANATION:
    "* How much people from one country trust people from another country, relative to the consensus and their general level of trust",
  LEFT_TEXT: "How much people from these countries...",
  RIGHT_TEXT: "...trust people from these countries*",
}

export {
  COUNTRY_ORDER,
  DATASET_URL,
  GRAPH_URL,
  TEXTS,
  COLOR_RANGE,
  COLOR_DOMAIN,
  OFFSET_RANGE,
  LEGEND_END_TEXTS,
  CREDIT_ELEMENTS
}
