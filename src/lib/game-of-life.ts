import cloneDeep from 'lodash.clonedeep'
import * as types from './types'

export function parseGameOfLifeRule (str: string): types.GameOfLifeRule {
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
  rule: types.GameOfLifeRule
  grid: types.GridCell[][]
  newGrid: types.GridCell[][]
  constructor (options: types.GameOfLifeOptions) {
    this.rule = parseGameOfLifeRule(options.rule ?? 'B3/S23')
    this.grid = cloneDeep(options.grid)
    this.newGrid = cloneDeep(options.grid)
  }

  loopCells (eachRowCb: types.LoopCellsCallback): void {
    this.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        eachRowCb(cell, { x: x, y: y })
      })
    })
  }

  getCell ({ x, y }: types.Position): types.GridCell | undefined {
    const gridWidth = this.grid[0].length
    const gridHeight = this.grid.length
    if (x < 0) x = gridWidth + x
    if (y < 0) y = gridHeight + y
    if (x > gridWidth - 1) x = x % gridWidth
    if (y > gridHeight - 1) y = y % gridHeight
    return this.grid[y]?.[x]
  }

  setCell ({ x, y }: types.Position, newCell: types.GridCell): void {
    this.newGrid[y][x] = newCell
  }

  getNeighbours ({ x, y }: types.Position): types.GridCell[] {
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
      .filter(types.isGridCell)
  }

  cellStats (pos: types.Position): types.GridCellStats {
    const result: types.GridCellStats = {
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
