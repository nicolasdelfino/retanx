// Grid singleton
export const Dimensions = () => ({
  width: 600,
  height: 300,
  divider: 6
})

function Cell() {
  this.x = 0
  this.y = 0
  this.f = 0
  this.g = 0
  this.h = 0
  this.row = 0
  this.col = 0
}

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
         let cell = new Cell()
         cell.x = s
         cell.y = a
         cell.row = s
         cell.col = a
         grid[s][a] = cell
       }
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
