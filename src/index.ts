import { HashOfLife } from './lib/hash-of-life'

const input = 'Hello world!'

const hol = new HashOfLife({
  data: Buffer.from(input),
  size: 100,
  iterations: 10
})

// const hash = hol.calculateHash()
// console.log(hash)

;(async () => {
  let i = 0
  while (i++ < 11) {
    console.clear()
    console.log(`Input: "${input}"`)
    hol.iterate()
    const hash = hol.calculateHash(false)
    console.log(`Output: "${hash}"`)
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
})().catch(console.error)
