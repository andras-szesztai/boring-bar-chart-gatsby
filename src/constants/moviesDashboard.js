import { colors } from "../themes/theme"

export const IMAGE_ROOT = "https://image.tmdb.org/t/p/w500"
export const API_ROOT = "https://api.themoviedb.org/3"

export const COLORS = {
  primary: "#6a8caf",
  primaryLight: "#d6f4f7",
  primaryDark: "#3b5f80",
  secondary: "#79dc96",
  favorite: "#ffa71e",
  delete: "#fc5050",
  textColor: colors.grayDarker
}

export const TRANSITION = {
  primary: {
    type: "spring",
    damping: 12,
  },
}

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

export const makeOpacityVariant = ({startDelay = 0 }) => ({
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      delay: startDelay
    }
  },
  exit: {
    opacity: 0,
    transition: {
      delay: 0
    }
  },
})

export const ANIMATE_PROPS = {
  initial: "initial",
  animate: "animate",
  exit: "exit",
}


export const LOCAL_STORE_ACCESSORS = {
  lockedPersonDetailCard: "lockedPersonDetailCard",
  favoritePersons: "favoritePersons"
}


export const FIXED_DIMS = {
  listItemGrowth:  180,
  controlCollapsedWidth: 200
}

