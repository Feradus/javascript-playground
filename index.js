import {
  CANVAS_SIZE,
  CELL_SIZE,
  GRID_SIZE,
  LINE_WIDTH,
  ANIMATION_SPEED,
} from "./constants.js"

let cells = []
let gameIsRunning = false
let intervalFunction
const canvas = document.getElementById("canvas")
canvas.addEventListener("click", handleChangeCell)
const startButton = document.getElementById("startButton")
startButton.addEventListener("click", handleStartButton)
const stopButton = document.getElementById("stopButton")
stopButton.addEventListener("click", handleStopButton)
const clearButton = document.getElementById("clearButton")
clearButton.addEventListener("click", handleClearButton)
const context = canvas.getContext("2d")
context.lineWidth = LINE_WIDTH
drawGrid()
initializeCells()

function initializeCells() {
  for (let x = 0; x < GRID_SIZE; x++) {
    cells[x] = []
    for (let y = 0; y < GRID_SIZE; y++) {
      cells[x][y] = {
        currentIterationIsCellAlive: false,
        nextIterationIsCellAlive: false,
      }
    }
  }
}

function drawGrid() {
  for (let i = 0; i <= CANVAS_SIZE / CELL_SIZE; i++) {
    context.beginPath()
    context.moveTo(i * CELL_SIZE, 0)
    context.lineTo(i * CELL_SIZE, CANVAS_SIZE)
    context.stroke()
    context.beginPath()
    context.moveTo(0, i * CELL_SIZE)
    context.lineTo(CANVAS_SIZE, i * CELL_SIZE)
    context.stroke()
  }
}

function handleChangeCell(event) {
  if (gameIsRunning) {
    return
  }

  const cellIndexes = getCellIndicesFromCoordinates(
    event.clientX,
    event.clientY,
  )
  changeCellStatusManually(cellIndexes.x, cellIndexes.y)
}

function handleStartButton(event) {
  gameIsRunning = true
  startButton.setAttribute("disabled", true)
  stopButton.removeAttribute("disabled")
  startGame()
}

function handleStopButton(event) {
  gameIsRunning = false
  startButton.removeAttribute("disabled")
}

function handleClearButton(event) {
  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
  drawGrid()
  initializeCells()
}

function changeCellStatusManually(x, y) {
  fillCellByIndices(x, y)
  cells[x][y].currentIterationIsCellAlive =
    !cells[x][y].currentIterationIsCellAlive
}
function getCellIndicesFromCoordinates(x, y) {
  const rect = canvas.getBoundingClientRect()
  const xIndex = Math.floor((x - rect.left) / CELL_SIZE)
  const yIndex = Math.floor((y - rect.top) / CELL_SIZE)

  return { x: xIndex, y: yIndex }
}

function fillCellByIndices(x, y) {
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

function startGame() {
  intervalFunction = setInterval(gameLoop, ANIMATION_SPEED)
}

function gameLoop() {
  if (gameIsRunning) {
    computeGameState()
    updateGameState()
  } else {
    clearInterval(intervalFunction)
  }
}

function computeGameState() {
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      cells[x][y].nextIterationIsCellAlive = computeIfNextIterationCellIsAlive(
        x,
        y,
        cells[x][y].currentIterationIsCellAlive,
      )
    }
  }
}

function updateGameState() {
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (
        cells[x][y].nextIterationIsCellAlive !==
        cells[x][y].currentIterationIsCellAlive
      ) {
        fillCellByIndices(x, y)
        cells[x][y].currentIterationIsCellAlive =
          cells[x][y].nextIterationIsCellAlive
      }
    }
  }
}

function computeIfNextIterationCellIsAlive(x, y, isAlive) {
  let neighbours = 0

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue
      }

      let newX = x + i
      let newY = y + j

      if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
        if (cells[newX][newY].currentIterationIsCellAlive) {
          neighbours++
        }
      }
    }
  }

  return neighbours === 3 || (isAlive && neighbours === 2)
}
