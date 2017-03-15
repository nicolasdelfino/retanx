// Grid singleton
function CELL() {
  this.x = 0
  this.y = 0

  this.f = 0
  this.g = 0
  this.h = 0

  this.row = 0
  this.col = 0
}

export const Dimensions = () => ({
  width: 1000,
  height: 100,
  divider: 10
})

export const Grid = function() {

  var instance = null

  function createGrid() {

     var grid = []
     let divider = Dimensions().divider
     let w = Dimensions().width / divider
     let h = Dimensions().height / divider
     let cols = divider
     let rows = Dimensions().height / 100

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
