export function getCellIndicesFromCoordinates(x, y) {
  const rect = canvas.getBoundingClientRect()
  const xIndex = Math.floor((x - rect.left) / CELL_SIZE)
  const yIndex = Math.floor((y - rect.top) / CELL_SIZE)

  return { x: xIndex, y: yIndex }
}