export interface GameOfLifeRule {
  type: 'life'
  born: number[]
  survival: number[]
}

export interface GameOfLifeOptions {
  rule?: string
  grid: number[][]
}

export interface GridCellStats {
  neighboursAlive: number
  neighboursDead: number
}

export type GridCell = number

export function isGridCell (cell: any): cell is GridCell {
  return typeof cell === 'number'
}

export interface Position {
  x: number
  y: number
}

export type LoopCellsCallback = (cell: GridCell, position: Position) => void
