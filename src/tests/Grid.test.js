import { Grid } from '../grid/Grid'


it('returns a grid array matching 5 x 3', () => {

  const tempDimensions = () => ({
    width: 500,
    height: 300,
    tileSize: 100
  })

  Grid.setSettings(tempDimensions, null)
  let grid = Grid.getInstance(false)

  expect(grid.getGrid().length).toBe(5)
  expect(grid.getGrid()[0].length).toBe(3)
});

it('returns a grid array matching 2 x 6', () => {

  const tempDimensions = () => ({
    width: 200,
    height: 600,
    tileSize: 100
  })

  Grid.setSettings(tempDimensions, null)
  let grid = Grid.getInstance(true)

  expect(grid.getGrid().length).toBe(2)
  expect(grid.getGrid()[0].length).toBe(6)
});


it('reflects tilemap obstacles', () => {

  const tempDimensions = () => ({
    width: 300,
    height: 300,
    tileSize: 100
  })

  const tempMap = function() {
    this.getTiles = () => {
      return [
        1,  1,  1,
        1,  1,  0,
        1,  1,  1
        ]
    }

    let types = {
      0: 'ground',
      1: 'obstacle',
      2: 'wall'
    }

    this.getCellType = prop => {
      return types[prop]
    }
  }

  Grid.setSettings(tempDimensions, tempMap)
  let gridInstance = Grid.getInstance(true)
  gridInstance.resetCells()

  let grid = gridInstance.getGrid()

  // console.warn('** COLS', grid.length)
  // console.warn('** ROWS', grid[0].length)
  // grid.forEach((g, i) => {
  //   console.log('___________________________________________')
  //   g.map((gg, x) => {
  //       console.log('cell', i, x, gg.obstacle === true ? '---> true' : gg.obstacle)
  //   })
  // })

  //columns, first
  expect(grid[0][0].obstacle).toBe(true)
  expect(grid[0][1].obstacle).toBe(true)
  expect(grid[0][2].obstacle).toBe(true)
  //second
  expect(grid[1][0].obstacle).toBe(true)
  expect(grid[1][1].obstacle).toBe(true)
  expect(grid[1][2].obstacle).toBe(true)
  //third
  expect(grid[2][0].obstacle).toBe(true)
  expect(grid[2][1].obstacle).toBe(false)
  expect(grid[2][2].obstacle).toBe(true)

});
