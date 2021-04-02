import { GameOfLife } from './lib/game-of-life'

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
