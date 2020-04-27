import { colors } from "../../themes/theme"

export const DATA_URL_HU =
  "https://boring-barchart-gatsby.firebaseio.com/coronavirus-hungary.json"

export const DATA_URL_EN =
  "https://boring-barchart-gatsby.firebaseio.com/coronavirus-hungary-en.json"

export const chartColors = {
  female: "#DC8744",
  male: "#4f345a",
  total: "#619293",
  bgColor: colors.white,
}

export const CIRCLE_RADIUS = 5

export const lowOpacity = 0.75
export const lowestOpacity = 0.25

export const TEXT = {
  helmet: {
    hu: "Koronavírusban elhunytak Magyarországon",
    en: "Deaths caused by COVID-19 in Hungary",
  },
  mainTitle: {
    hu:
      "Az új koronavírusban elhunytak száma, korban és nembeni megoszlása Magyarországon",
    en:
      "Number of deaths caused by COVID-19 in Hungary, distribution by gender and age",
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
  date: {
    hu: "Dátum",
    en: "Date",
  },
  dateSlider: {
    hu: "Válasszon másik dátumot",
    en: "Choose another date",
  },
  dateFormatLong: {
    hu: "Y'.' MM'.' dd'.'",
    en: "dd'.' MM'.' Y'.'",
  },
  dateFormatShort: {
    hu: "MM'.' dd'.'",
    en: "dd'.' MM'.'",
  },
  accessorF: {
    hu: "Nő",
    en: "Female",
  },
  genderF: {
    hu: "Nõ",
    en: "Female",
  },
  genderM: {
    hu: "Férfi",
    en: "Male",
  },
  accessorM: {
    hu: "Férfi",
    en: "Male",
  },
  genderPerc: {
    hu: "Nemek százalékos megoszlása",
    en: "Gender distribution",
  },
  displayTest: {
    hu: ["Összesen", "Nemek szerint"],
    en: ["Total", "Per gender"],
  },
  chartTitles: {
    cumulative: {
      total: {
        hu: "Elhunytak száma március 20-a óta összesen (kumulatív)",
        en: "Total number of decceased since the 20th of March (cumulative)",
      },
      gender: {
        hu: "Elhunytak száma március 20-a óta nemek szerint (kumulatív)",
        en:
          "Number of deceased per gender since the 20th of March (cumulative)",
      },
    },
    daily: {
      total: {
        hu: "Elhunytak száma naponta március 26-a óta (7 napos mozgóátlag)",
        en:
          "Number of death/day since the 26th of March (7 day moving average)",
      },
      gender: {
        hu:
          "Elhunytak száma naponta március 26-a óta nemek szerint (7 napos mozgóátlag)",
        en:
          "Number of death/day since the 26th of March (7 day moving average per gender)",
      },
    },
    age: {
      total: {
        hu: "Elhunytak átlagéletkora",
        en: "Average age of the deceased over time",
      },
      gender: {
        hu: "Elhunytak átlagéletkora nemek szerint",
        en: "Average age of the deceased over time per gender",
      },
    },
    ratio: {
      total: {
        hu: "Nemek százalékos megoszlása",
        en: "Gender distribution",
      },
      gender: {
        hu: "Nemek százalékos megoszlása",
        en: "Gender distribution",
      },
    },
    main: {
      total: {
        hu:
          "Mindegyik kör egy-egy elhunytat képvisel a horizontális tengelyen pozícionálva az elhunyt személy kora alapján",
        en:
          "Each dot represents someone passed away, the position on the horizontal axis is determined by the age of the deceased",
      },
      gender: {
        hu:
          "Mindegyik kör egy-egy elhunytat képvisel a horizontális tengelyen pozícionálva az elhunyt személy kora alapján (nemek szerint megosztva vertikálisan)",
        en:
          "Each dot represents someone passed away, the position on the horizontal axis is determined by the age of the deceased (grouped by gender on the y-axis)",
      },
    },
  },
  mainChartExpBrowser: {
    hu:
      "Mindegyik kör egy-egy elhunytat képvisel a horizontális tengelyen pozícionálva az elhunyt személy kora alapján",
    en:
      "Each dot represents someone passed away, the position on the horizontal axis is determined by the age of the deceased",
  },
  hoverText: {
    hu:
      "Mutasson az egérrel bármelyik körre információért az elhunyt személy alapbetegségeirõl!",
    en:
      "Hover over any circle to find out more about the underlying conditions of the deceased person!",
  },
  total: {
    en: "Total",
    hu: "Összes",
  },
  female: {
    hu: "Nõ",
    en: "Female",
  },
  male: {
    en: "Male",
    hu: "Férfi",
  },
  checkBox: {
    hu: "Összes",
    en: "Display total",
  },
  tooltipGender: {
    hu: "Nem",
    en: "Gender",
  },
  tooltipAge: {
    hu: "Életkor",
    en: "Age",
  },
  chartAxisNumber: {
    hu: "Elhunytak száma",
    en: "Number of deaths",
  },
  tooltipYear: {
    hu: "év",
    en: "years",
  },
  tooltipConditions: {
    hu: "Alapbetegség(ek)",
    en: "Underlying conditions",
  },
  tabletExp: {
    hu: "A tablet verzió hamarosan elkészül, köszönjük türelmét!",
    en: "The tablet version is coming soon, thank you for your patience!",
  },
  mobileExp: {
    hu: "A mobil verzió hamarosan elkészül, köszönjük türelmét!",
    en: "The mobile version is coming soon, thank you for your patience!",
  },
  dailyBefore: {
    hu: "Nem elérhetõ adat március 26-a elõtt",
    en: "Not applicable before the 26th of March",
  },
  ratioFront: {
    desktop: {
      hu:
        "A nemek szerinti százalékos megoszlás nem elérhetõ kombinált számolással, kérjük kattintson a kártyára a nemek szerinti adatokért",
      en:
        "Data revealing gender distribution is not applicable on combined level, please click on the card to see per gender data",
    },
    mobile: {
      hu:
        "A nemek szerinti százalékos megoszlás nem elérhetõ kombinált számolással, kérjük érintse meg a kártyát a nemek szerinti adatokért",
      en:
        "Data revealing gender distribution is not applicable on combined level, please tap on the card to see per gender data",
    },
  },
  cardExplanation: {
    desktop: {
      back: {
        hu: "Kattintson a kártyára a kombinált adatokért",
        en: "Click on the card to see total",
      },
      front: {
        hu: "Kattintson a kártyára a nemek szerinti adatokért",
        en: "Click on the card to see per gender data",
      },
    },
    mobile: {
      back: {
        hu: "Érintse meg a kártyát a kombinált adatokért",
        en: "Tap on the card to see total",
      },
      front: {
        hu: "Érintse meg a kártyát a nemek szerinti adatokért",
        en: "Tap on the card to see per gender data",
      },
    },
  },
}
