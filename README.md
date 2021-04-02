# Hash of Life
Checking if Conway's game of life can be used as a "hashing" algorithm.

## Usage
Easy.. **don't!**

But if you want to test it:
```sh
git clone https://github.com/Sherex/hash-of-life
cd hash-of-life

npm install

npm run dev
```

## Flow
1. Receives a Buffer with data to be encrypted
2. Converts the buffer to a string of bits
3. Each bit represents a cell on the Game of Life grid. (Rows are split on a specified width)
4. It iterates over a specified number of cycles (Evolving the game)
5. Then converts the game grid back to a bit string and then outputs it in hex.

## Further improvements
- [ ] Automatic grid sizing based on data input
- [ ] (?) If less than X% of tile are alive; merge the initial grid with the current.
  - [ ] Rotate before merge
  - [ ] Make sure that there is at least a few number of iterations left

## LICENSE
[MIT](LICENSE)