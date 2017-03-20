import { Cell } from './Cell'

// Grid singleton
export const Dimensions = () => ({
  width: 900,
  height: 500,
  divider: 9
})

export const Grid = function() {

  var instance = null

  function createGrid() {
     var grid     = []
     let divider  = Dimensions().divider
     let cols     = divider
     let rows     = Dimensions().height / 100

     for(var s = 0; s < cols; s++) {
       grid[s] = new Array(rows)
       for(var a = 0; a < rows; a++) {
         let cell = new Cell(Dimensions)
         cell.x = s
         cell.y = a
         cell.row = s
         cell.col = a
         grid[s][a] = cell
       }
     }

     function addCellNeighbors() {
       for(var e = 0; e < cols; e++) {
         for(var r = 0; r < rows; r++) {
           grid[e][r].addNeighbors(grid)
         }
       }
     }

     function resetCells() {
       for(var e = 0; e < cols; e++) {
         for(var r = 0; r < rows; r++) {
           grid[e][r].reset()
         }
       }
     }

     function getPositionForCell(cell) {
       return grid[cell.x][cell.y].position
     }

     function makeObstaclesOfInactiveUnits(units, startIndex) {
       let n = units.filter((unit, index) => {
         return index !== startIndex
       })

       for(var e = 0; e < cols; e++) {
         for(var r = 0; r < rows; r++) {
           grid[e][r].reset()

           // eslint-disable-next-line
           n.forEach((unit) => {
             if(grid[e][r].x === unit.position.x && grid[e][r].y === unit.position.y ) {
              //  console.warn('obstacle found', grid[e][r])
               grid[e][r].obstacle = true
             }
           })
         }
       }
     }

     function suggestedPositionIsAnObstacleCell(position) {
       return grid[position.x][position.y].obstacle
     }

     //getters
     function getGrid() { return grid }
     function getCols() { return cols }
     function getRows() { return rows }
     function getDivider() { return divider }

     //setters
     function setGrid(val) { grid = val }

     return {
        getGrid: getGrid,
        setGrid: setGrid,
        getCols: getCols,
        getRows: getRows,
        getDivider: getDivider,
        resetCells: resetCells,
        addCellNeighbors: addCellNeighbors,
        getPositionForCell: getPositionForCell,
        makeObstaclesOfInactiveUnits: makeObstaclesOfInactiveUnits,
        suggestedPositionIsAnObstacleCell: suggestedPositionIsAnObstacleCell
     }
  }

  return {
     getInstance: function() {
        if(!instance) {
           instance = createGrid();
        }
        return instance;
     }
  }
}()
