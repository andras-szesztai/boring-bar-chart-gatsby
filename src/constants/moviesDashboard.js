import { colors } from "../themes/theme"

export const IMAGE_ROOT = "https://image.tmdb.org/t/p/w500"
export const API_ROOT = "https://api.themoviedb.org/3"

export const COLORS = {
  primary: "#6a8caf",
  primaryLight: "#d6f4f7",
  favorite: "#ffa71e",
  textColor: colors.grayDarker
}

// #FFA016

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

export const ANIMATE_PROPS = {
  initial: "initial",
  animate: "animate",
  exit: "exit",
}


export const LOCAL_STORE_ACCESSORS = {
  lockedPersonDetailCard: "lockedPersonDetailCard",
  favoritePersons: "favoritePersons"
}

