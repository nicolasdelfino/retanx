import { Dimensions, Grid } from '../../grid/Grid'
let _grid = Grid.getInstance()

export const UnitUtils = function() {
  var instance = null

  function createUtils() {

    function isPositionAvaliable(position, units) {
      let isAvailable = true
      if(_grid.suggestedPositionIsAnObstacleCell(position)) {
        return false
      }

      // check units
      units.forEach((tank, index) => {
        if(tank.position.x === position.x && tank.position.y === position.y) {
          isAvailable = false
        }
      })

      return isAvailable
    }

    function getRandomPosition(units) {
      let columns = _grid.getCols()
      let rows = _grid.getRows()
      return {
        x: Math.floor(Math.random() * columns),
        y: Math.floor(Math.random() * rows)
      }
    }
    function getRandomPos(units) {
      let foundPosition = false
      let position = null
      let maxTries = _grid.getCols() * _grid.getRows()

      if(units.length === 0) {
        return getRandomPosition(units)
      }

      for(var i = 0; i < maxTries; i++) {
        position = getRandomPosition()
        // eslint-disable-next-line
        foundPosition = isPositionAvaliable(position, units)
        if(foundPosition) {
          break;
        }
      }
      return foundPosition ? position : undefined
    }

    return {
      getRandomPos: getRandomPos
    }
  }

  return {
     getInstance: function() {
        if(!instance) {
           instance = createUtils();
        }
        return instance;
     }
  }
}()
