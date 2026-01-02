export function getCellIndicesFromCoordinates(x, y) {
  const rect = canvas.getBoundingClientRect()
  const xIndex = Math.floor((x - rect.left) / CELL_SIZE)
  const yIndex = Math.floor((y - rect.top) / CELL_SIZE)

  return { x: xIndex, y: yIndex }
}

export function fillCellByIndices(x, y) {
  if (cells[x][y].currentIterationIsCellAlive) {
    context.fillStyle = "white"
  } else {
    context.fillStyle = "black"
  }

  context.fillRect(
    x * CELL_SIZE + LINE_WIDTH / 2,
    y * CELL_SIZE + LINE_WIDTH / 2,
    CELL_SIZE - LINE_WIDTH,
    CELL_SIZE - LINE_WIDTH,
  )
}
