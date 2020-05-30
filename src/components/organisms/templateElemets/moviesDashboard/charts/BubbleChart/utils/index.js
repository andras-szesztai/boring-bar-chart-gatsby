

export const setRadius = ({adjust = 0, isSizeDynamic, currSizeScale}) => d =>
  isSizeDynamic
    ? currSizeScale(d.vote_count) + adjust
    : 6 + adjust
