

const chessReducer = (state, { type, payload }) => {
  switch (type) {
    case "check":
      return {
        ...state,
        [payload]: { ...state[payload], checked: !state[payload].checked },
      }
    default:
      return state
  }
}

export default chessReducer
