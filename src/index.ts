interface GameOfLifeRule {
  type: 'life'
  born: number[]
  survival: number[]
}

interface GameOfLifeOptions {
  rule: string
  board: number[][]
}

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
  board: number[][]
  constructor (options: GameOfLifeOptions) {
    this.rule = parseGameOfLifeRule(options.rule)
    this.board = options.board
  }
}

const gol = new GameOfLife({
  rule: 'B3/S23',
  board: [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0]
  ]
})

console.log(gol.rule)
