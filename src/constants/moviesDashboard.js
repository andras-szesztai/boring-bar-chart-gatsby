import { colors, space } from "../themes/theme"

export const IMAGE_ROOT = "https://image.tmdb.org/t/p/w500"
export const API_ROOT = "https://api.themoviedb.org/3"



export const COLORS = {
  primaryLight: "#8E7595",
  primary: "#79627F",
  primaryDark: "#635068",
  secondaryLight: "#A7C8C8",
  secondary: "#8EB7B8",
  secondaryDark: "#82B0B0",
  favorite: "#FFDA47",
  textColor: colors.grayDarker,
  gridColor: colors.gray,
  backgroundGray: colors.whiteDark,
}

export const TRANSITION = {
  primary: {
    type: "spring",
    damping: 12,
  },
}

export const WHILE_HOVER = {
  scale: 1.3,
}

export const CHART_SIDE_MARGINS = {
  left: 25,
  right: 25,
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
  favoriteMovies: "favoriteMovies",
  isVisited: "isVisited"
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

export const NO_ACTIVE_MOVIE = {
  id: undefined,
  data: { undefined },
  position: undefined,
  cast: [],
  crew: [],
}

export const NO_HOVERED_MOVIE = {
  id: undefined,
  data: {},
  xPosition: undefined,
  yPosition: undefined,
}

export const TIMEOUT = {
  short: 300
}
