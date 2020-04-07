export const DATA_URL =
  "https://boring-barchart-gatsby.firebaseio.com/coronavirus-hungary.json"

export const chartColors = {
  female: "#8C635B",
  male: "#496366",
}

export const lowOpacity = 0.75

export const TEXT = {
  mainTitle: {
    hu:
      "Az új koronavírusban elhunytak száma, korban es nembeni eloszlása Magyarországon",
    en:
      "Number of deaths by COVID-19 in Hungary, distribution by gender and age",
  },
  sourceTitle: {
    hu: "Forrás",
    en: "Source",
  },
  source: {
    hu: "koronavirus.gov.hu",
    en: "abouthungary.hu",
  },
  url: {
    hu: "https://koronavirus.gov.hu/",
    en: "http://abouthungary.hu/",
  },
  total: {
    hu: "Összesen",
    en: "Total",
  },
  dateSlider: {
    hu: "Válasszon dátumot",
    en: "Choose a date",
  },
  dateFormatLong: {
    hu: "Y'.' MM'.' dd'.'",
    en: "dd'.' MM'.' Y'.'",
  },
  dateFormatShort: {
    hu: "MM'.' dd'.'",
    en: "dd'.' MM'.'",
  },
  genderF: {
    hu: "Nõ",
    en: "Female",
  },
  genderM: {
    hu: "Férfi",
    en: "Male",
  },
  genderPerc: {
    hu: "Nemek százalékos megoszlása",
    en: "Gender distribution",
  },
  mainChartExpBrowser: {
    hu:
      "Mindegyik kör egy-egy elhunytat képvisel a horizontális tengelyen pozícionálva az elhunyt személy kora alapján",
    en:
      "Each dot represents someone passed away, the position on the horizontal axis is determined by the age of the deceased",
  },
  hoverText: {
    hu: "Mutasson az egérrel bármelyik körre információért az elhunyt személy alapbetegségeirõl!",
    en: "Hover over any circle to find out more about the underlying conditions of the deceased person!",
  },
  tabletExp: {
    hu: "A tablet verzió hamarosan elkészül, köszönjük türelmét!",
    en: "The tablet version is coming soon, thank you for your patience!",
  },
  mobileExp: {
    hu: "A mobil verzió hamarosan elkészül, köszönjük türelmét!",
    en: "The mobile version is coming soon, thank you for your patience!",
  },
}
