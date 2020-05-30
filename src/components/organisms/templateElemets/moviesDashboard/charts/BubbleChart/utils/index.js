export const setRadius = ({ adjust = 0, isSizeDynamic, currSizeScale }) => d =>
  isSizeDynamic ? currSizeScale(d.vote_count) + adjust : 6 + adjust

export const getSelectedLineYPos = ({
  data,
  scales: { yScale, currSizeScale },
  props: { isSizeDynamic, chart },
}) => {
  return chart === "main"
    ? yScale(data.vote_average) +
        setRadius({ adjust: 4, isSizeDynamic, currSizeScale })(data)
    : yScale(data.vote_average) -
        setRadius({ adjust: 4, isSizeDynamic, currSizeScale })(data)
}
