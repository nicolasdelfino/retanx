import { Dimensions, Grid } from '../grid/Grid'



it('returns a grid arrayaaaa', () => {
  let grid = Grid.getInstance()
  console.log('g', grid.getGrid(12, 12, 12).length)
  expect(grid.getGrid().length).toBeGreaterThan(0)
});
