import { Grid } from '../grid/Grid'
import { AStar } from '../grid/AStar'

const tempDimensions = () => ({
  width: 300,
  height: 300,
  tileSize: 100
})


it('finds a path in given grid', () => {

  const tempMap = function() {
    this.getTiles = () => {
      return [
        0,  1,  1,
        0,  0,  1,
        1,  0,  0
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

  let grid  = gridInstance.getGrid()
  let start = grid[0][0]
  let end   = grid[2][2]

  let path = AStar(gridInstance, start, end, [], null)

  expect(path.length).toBeGreaterThan(0)
});

it('fails to find a path in given grid', () => {

  const tempMap = function() {
    this.getTiles = () => {
      return [
        0,  1,  1,
        0,  0,  1,
        1,  0,  1
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

  let grid  = gridInstance.getGrid()
  let start = grid[0][0]
  let end   = grid[2][2]

  let path = AStar(gridInstance, start, end, [], null)

  expect(path.length).toBe(0)
});
