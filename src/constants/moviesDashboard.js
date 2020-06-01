import { colors, space } from "../themes/theme"

export const IMAGE_ROOT = "https://image.tmdb.org/t/p/w500"
export const API_ROOT = "https://api.themoviedb.org/3"

export const COLORS = {
  primaryLight: "#d6f4f7",
  primary: "#6a8caf",
  primaryDark: "#7ebdb4",
  secondary: "#9ae17b",
  secondaryDark: "#69af4d",
  delete: "#fc5050",
  favorite: "#ffa71e",
  textColor: colors.grayDarker,
  gridColor: colors.gray,
}

export const TRANSITION = {
  primary: {
    type: "spring",
    damping: 12,
  },
}

export const CHART_SIDE_MARGINS = {
  left: 10,
  right: 20,
}

export const SIZE_RANGE = [2, 20]
export const CIRCLE_ADJUST = 4
export const HANDLE_SIZE = space[6]

export const OPACITY_VARIANT = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

export const makeOpacityVariant = ({ startDelay = 0 }) => ({
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      delay: startDelay,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      delay: 0,
    },
  },
})

export const ANIMATE_PROPS = {
  initial: "initial",
  animate: "animate",
  exit: "exit",
}

export const LOCAL_STORE_ACCESSORS = {
  lockedPersonDetailCard: "lockedPersonDetailCard",
  favoritePersons: "favoritePersons",
}

export const FIXED_DIMS = {
  listItemGrowth: 180,
  controlCollapsedWidth: 200,
}

export const CARD_WIDTH = 400
export const CARD_HEIGHT = {
  person: 240,
  movie: 480,
}
