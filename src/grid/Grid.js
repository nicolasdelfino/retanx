import { Cell } from './Cell'

// Grid singleton
export const Dimensions = () => ({
  width: 1000,
  height: 2000,
  divider: 9,
  tileSize: 100
})

export const Grid = function() {

  var instance = null

  function createGrid() {
     var grid     = []
     let divider  = Dimensions().divider
     let cols     = Dimensions().width / Dimensions().tileSize
     let rows     = Dimensions().height / Dimensions().tileSize

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

     function addCellNeighbors(aStarStyle) {
       for(var e = 0; e < cols; e++) {
         for(var r = 0; r < rows; r++) {
           grid[e][r].addNeighbors(grid, aStarStyle)
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

     function makeObstaclesOfUnitsWithHigherMass(activeUnit, units, startIndex) {
       let n = units.filter((unit, index) => {
         return index !== startIndex
       })

       for(var e = 0; e < cols; e++) {
         for(var r = 0; r < rows; r++) {
           grid[e][r].reset()

           // eslint-disable-next-line
           n.forEach((unit) => {
             if(grid[e][r].x === unit.position.x && grid[e][r].y === unit.position.y ) {
               if(unit.mass >= activeUnit.mass && unit.alive) {
                 grid[e][r].unitObstacle = true
               }
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
        makeObstaclesOfUnitsWithHigherMass: makeObstaclesOfUnitsWithHigherMass,
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
