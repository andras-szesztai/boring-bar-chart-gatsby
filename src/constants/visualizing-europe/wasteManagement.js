import { colors, fontSize } from "../../themes/theme"

const DATA_URL =
  "https://boring-barchart-gatsby.firebaseio.com/waste-management.json"

export const COLOR_ARRAY = ["#E58272", "#63b7af", "#35495e"]

export const DROPDOWN_STYLES = {
  option: (provided, state) => {
    return {
      ...provided,
      color: state.isSelected ? "#fff" : colors.grayDarkest,
      cursor: state.isSelected ? "auto" : "pointer",
      backgroundColor: state.isSelected
        ? colors.grayDarkest
        : state.isFocused
        ? colors.grayLightest
        : "#fff",
      ":active": {
        backgroundColor: colors.grayLightest,
      },
    }
  },
  control: provided => {
    return {
      ...provided,
      borderColor: colors.grayLightest,
      height: 10,
      boxShadow: "none",
      cursor: "pointer",
      "&:hover": {
        borderColor: colors.grayLightest,
      },
    }
  },
  clearIndicator: provided => {
    return {
      ...provided,
      color: colors.grayLightest,
      opacity: 1,
      "&:hover": {
        color: colors.grayDarkest,
      },
    }
  },
  dropdownIndicator: provided => {
    return {
      ...provided,
      color: colors.grayLightest,
      opacity: 1,
      "&:hover": {
        color: colors.grayDarkest,
      },
    }
  },
  input: provided => {
    return {
      ...provided,
      fontWeight: 100,
    }
  },
  valueContainer: provided => ({
    ...provided,
    fontSize: fontSize[1],
  }),
}

export const CREDIT_ELEMENTS = [
  {
    justify: "flex-start",
    text: "Built and designed by",
    link: "https://twitter.com/AndSzesztai",
    anchorText: "András Szesztai",
  },
  {
    justify: "flex-start",
    text: "Original article",
    link:
      "https://ec.europa.eu/eurostat/web/products-eurostat-news/-/DDN-20200318-1?inheritRedirect=true&redirect=%2Feurostat%2Fnews%2Fwhats-new",
    anchorText: "eurostat",
  },
  {
    justify: "flex-start",
    text: "Data source",
    link:
      "https://appsso.eurostat.ec.europa.eu/nui/show.do?query=BOOKMARK_DS-150766_QID_-44B068B5_UID_-3F171EB0&layout=TIME,C,X,0;GEO,L,Y,0;WST_OPER,L,Z,0;UNIT,L,Z,1;INDICATORS,C,Z,2;&zSelection=DS-150766WST_OPER,GEN;DS-150766UNIT,KG_HAB;DS-150766INDICATORS,OBS_FLAG;&rankName1=UNIT_1_2_-1_2&rankName2=INDICATORS_1_2_-1_2&rankName3=WST-OPER_1_2_-1_2&rankName4=TIME_1_1_0_0&rankName5=GEO_1_2_0_1&sortC=DESC_-1_FIRST&rStp=&cStp=&rDCh=&cDCh=&rDM=true&cDM=true&footnes=false&empty=false&wai=false&time_mode=ROLLING&time_most_recent=true&lang=EN&cfo=%23%23%23%2C%23%23%23.%23%23%23",
    anchorText: "Municipal waste dataset",
  },
]

const WASTE_MANAGEMENT_CONSTANTS = {
  DATA_URL,
}

export default WASTE_MANAGEMENT_CONSTANTS
