import { GameOfLife } from './game-of-life'
import { HashOfLifeOptions, GridCell } from './types'

export class HashOfLife {
  private readonly gol: GameOfLife
  private readonly iterations: number
  constructor (options: HashOfLifeOptions) {
    // TODO: Auto set size
    if (options.data.length * 8 > options.size) throw new Error('Size too small!')
    if (Math.sqrt(options.size) % 1 !== 0) throw new Error('Invalid size!')
    const toPad = options.size - options.data.length * 8

    this.iterations = options.iterations

    const grid: GridCell[][] = []

    let currentGridHeight = -1
    options.data.forEach((byte, byteIndex) => {
      let bits = byte.toString(2)
      if (bits.length < 8) {
        const zeroPadding = '0'.repeat(8 - bits.length)
        bits = zeroPadding + bits
      }

      if (byteIndex + 1 === options.data.length) bits = '0'.repeat(toPad) + bits
      bits.split('').forEach((bit, bitIndex) => {
        const width = Math.sqrt(options.size)
        if ((byteIndex * 8 + bitIndex) % width === 0) {
          currentGridHeight++
          grid[currentGridHeight] = []
        }
        grid[currentGridHeight].push(parseInt(bit))
      })
    })

    this.gol = new GameOfLife({
      rule: options.rule,
      grid
    })
  }

  calculateHash (autoIterate = true): string {
    if (autoIterate) {
      for (let i = 0; i < this.iterations; i++) {
        this.gol.iterate()
      }
    }

    const hex: string[] = []
    let byte: number[] = []
    this.gol.loopCells(cell => {
      if (byte.length < 8) {
        byte.push(cell)
      } else {
        const dec = parseInt(byte.join(''), 2)
        hex.push(dec.toString(16))
        byte = []
      }
    })

    return hex.join('')
  }

  iterate (): void {
    this.gol.iterate()
    this.gol.printGrid()
  }
}
