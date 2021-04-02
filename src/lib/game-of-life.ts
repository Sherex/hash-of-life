import cloneDeep from 'lodash.clonedeep'

interface GameOfLifeRule {
  type: 'life'
  born: number[]
  survival: number[]
}

interface GameOfLifeOptions {
  rule: string
  grid: number[][]
}

interface GridCellStats {
  neighboursAlive: number
  neighboursDead: number
}

type GridCell = number

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
  newGrid: GridCell[][]
  constructor (options: GameOfLifeOptions) {
    this.rule = parseGameOfLifeRule(options.rule)
    this.grid = cloneDeep(options.grid)
    this.newGrid = cloneDeep(options.grid)
  }

  loopCells (eachRowCb: LoopCellsCallback): void {
    this.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        eachRowCb(cell, { x: x, y: y })
      })
    })
  }

  getCell ({ x, y }: Position): GridCell | undefined {
    const gridWidth = this.grid[0].length
    const gridHeight = this.grid.length
    if (x < 0) x = gridWidth + x
    if (y < 0) y = gridHeight + y
    if (x > gridWidth - 1) x = x % gridWidth
    if (y > gridHeight - 1) y = y % gridHeight
    return this.grid[y]?.[x]
  }

  setCell ({ x, y }: Position, newCell: GridCell): void {
    this.newGrid[y][x] = newCell
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

  cellStats (pos: Position): GridCellStats {
    const result: GridCellStats = {
      neighboursAlive: 0,
      neighboursDead: 0
    }

    const neighbours = this.getNeighbours(pos)
    neighbours.forEach(cell => {
      if (cell === 1) result.neighboursAlive++
      else result.neighboursDead++
    })

    return result
  }

  printGrid (): void {
    const printBoard: string[] = []
    this.grid.forEach(row => {
      const rowStrings = row.map(cell => cell === 1 ? '#' : '-')
      printBoard.push(rowStrings.join(' '))
    })
    console.log(printBoard.join('\n'))
  }

  iterate (): void {
    this.loopCells((cell, pos) => {
      const stats = this.cellStats(pos)
      if (cell === 0) {
        if (this.rule.born.includes(stats.neighboursAlive)) this.setCell(pos, 1)
      } else {
        if (!this.rule.survival.includes(stats.neighboursAlive)) this.setCell(pos, 0)
      }
    })
    this.grid = cloneDeep(this.newGrid)
  }
}

const gol = new GameOfLife({
  rule: 'B3/S23',
  grid: [
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]
})

;(async () => {
  while (true) {
    console.clear()
    gol.printGrid()
    gol.iterate()
    await timeout(200)
  }
})().catch(console.error)

async function timeout (ms: number): Promise<void> {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
