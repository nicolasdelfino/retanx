import { Cell } from './Cell'
import { Map } from './maps/Map'

// Grid singleton
export const Dimensions = () => ({
  width: 1000,
  height: 2000,
  tileSize: 100
})

export const Grid = function() {
  let instance    = null

  let map         = null
  let tileMap     = null

  let dimensions  = null
  let oDimensions = null

  function createGrid() {

     map = tileMap === null ? new Map() : new tileMap()
     dimensions = oDimensions === null ? Dimensions() : oDimensions()

     var grid     = []
     let cols     = dimensions.width / dimensions.tileSize
     let rows     = dimensions.height / dimensions.tileSize
     let mapIndex = 0

     for(var s = 0; s < cols; s++) {
       grid[s] = new Array(rows)
       mapIndex = 0
       for(var a = 0; a < rows; a++) {
         let cellType = map.getCellType(map.getTiles()[s + mapIndex])

         let cell = new Cell(dimensions)
         cell.x   = s
         cell.y   = a
         cell.row = s
         cell.col = a
         grid[s][a] = cell

         cell.setType(cellType)

         mapIndex += cols
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

     //setters
     function setGrid(val) { grid = val }
     function setTileMap(val) { tileMap = val }
     function setODimensions(val) { oDimensions = val }

     return {
        getGrid:                            getGrid,
        setGrid:                            setGrid,
        getCols:                            getCols,
        getRows:                            getRows,
        setTileMap:                         setTileMap,
        setODimensions:                     setODimensions,
        resetCells:                         resetCells,
        addCellNeighbors:                   addCellNeighbors,
        getPositionForCell:                 getPositionForCell,
        makeObstaclesOfUnitsWithHigherMass: makeObstaclesOfUnitsWithHigherMass,
        suggestedPositionIsAnObstacleCell:  suggestedPositionIsAnObstacleCell
     }
  }

  return {
    setSettings: function(overrideDimensions, overrideTiles) {
        oDimensions = overrideDimensions !== null ? overrideDimensions : null
        tileMap     = overrideTiles !== null ? overrideTiles : null
        // if(tileMap !== null) {
        //   let m = new tileMap()
        //   console.warn(m.getTiles())
        // }
    },
    getInstance: function(freshInstance) {
      if(freshInstance && instance) {
        instance = null
        instance = createGrid()
      }
      else if(!instance) {
        instance = createGrid()
      }
      return instance;
    }
  }
}()
