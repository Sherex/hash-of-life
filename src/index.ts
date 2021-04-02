interface GameOfLifeRule {
  type: 'life'
  born: number[]
  survival: number[]
}

interface GameOfLifeOptions {
  rule: string
  grid: number[][]
}

type GridCell = number | string

function isGridCell (cell: any): cell is GridCell {
  return typeof cell === 'number'
}

interface Position {
  x: number
  y: number
}

type LoopCellsCallback = (cell: GridCell, position: Position) => void

export function parseGameOfLifeRule (str: string): GameOfLifeRule {
  const ruleRegex = /^B(?<born>[0-8]{0,8})\/S(?<survival>[0-8]{0,8})$/i
  const result = str.match(ruleRegex)
  if (result === null) throw new Error(`Invalid rule string, should match "${ruleRegex.source}"`)

  const bornStrings = result.groups?.born.split('') ?? []
  const survivalStrings = result.groups?.survival.split('') ?? []

  const born = bornStrings.map(bornString => parseInt(bornString))
  const survival = survivalStrings.map(survivalString => parseInt(survivalString))

  return {
    type: 'life',
    born,
    survival
  }
}

export class GameOfLife {
  rule: GameOfLifeRule
  grid: GridCell[][]
  constructor (options: GameOfLifeOptions) {
    this.rule = parseGameOfLifeRule(options.rule)
    this.grid = options.grid
  }

  loopCells (eachRowCb: LoopCellsCallback): void {
    this.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        eachRowCb(cell, { x: x, y: y })
      })
    })
  }

  getCell ({ x, y }: Position): GridCell | undefined {
    return this.grid[y]?.[x]
  }

  getNeighbours ({ x, y }: Position): GridCell[] {
    const neighbours = [
      { x: x - 1, y: y + 1 },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 },
      { x: x + 1, y: y },
      { x: x + 1, y: y - 1 },
      { x: x, y: y - 1 },
      { x: x - 1, y: y - 1 },
      { x: x - 1, y: y }
    ]
    return neighbours
      .map(cell => this.getCell({ x: cell.x, y: cell.y }))
      .filter(isGridCell)
  }

  printGrid (): void {
    const printBoard: string[] = []
    this.grid.forEach(row => {
      const rowStrings = row.map(cell => cell === 1 ? '#' : '-')
      printBoard.push(rowStrings.join(' '))
    })
    console.log(printBoard.join('\n'))
  }
}

const gol = new GameOfLife({
  rule: 'B3/S23',
  grid: [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0]
  ]
})

console.log(gol.getNeighbours({ x: 2, y: 2 }))
gol.printGrid()
