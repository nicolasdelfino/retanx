// Grid singleton
import DIMENSIONS from './Dimensions'

function CELL() {
  this.x = 0
  this.y = 0
  this.row = 0
  this.col = 0
}

export const Grid = function() {

  var instance = null

  function createGrid() {

     var grid = []
     let divider = 10
     let w = DIMENSIONS().width / divider
     let h = DIMENSIONS().height / divider
     let cols = divider
     let rows = 7

     for(var i = 0; i < cols; i++) {
       grid[i] = new Array(rows)
     }

     for(var s = 0; s < cols; s++) {
       for(var a = 0; a < rows; a++) {
         let cell = new CELL()
         cell.x = s
         cell.y = a
         cell.row = s
         cell.col = a
         grid[s][a] = cell
       }
     }

     //get
     function getGrid() {
        return grid;
     }

     function getCols() {
        return cols;
     }

     function getRows() {
        return rows;
     }

     function getDivider() {
        return divider;
     }

     //set
     function setGrid(val) {
       grid = val
     }

     return {
        getGrid: getGrid,
        setGrid: setGrid,
        getCols: getCols,
        getRows: getRows,
        getDivider: getDivider
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
