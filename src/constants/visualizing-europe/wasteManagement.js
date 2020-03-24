import { colors, fontSize } from "../../themes/theme"

const DATA_URL = "https://boring-barchart-gatsby.firebaseio.com/waste-management.json"
const CHART_MARGIN = { top: 10, right: 20, bottom: 25, left: 40 }

export const COLOR_ARRAY = ["#de88a5", "#7a9eaf", "#655989"]

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
  input: (provided, state) => {
    console.log(
      provided
    );
    console.log(
      state
    );
    
    return {
      ...provided,
      fontWeight: 100
    }
  },
  valueContainer: styles => ({
    ...styles,
    fontSize: fontSize[2]
  }),
}

const WASTE_MANAGEMENT_CONSTANTS = {
  DATA_URL,
  CHART_MARGIN
}


export default WASTE_MANAGEMENT_CONSTANTS
