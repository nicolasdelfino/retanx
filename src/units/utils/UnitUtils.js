import { Grid } from '../../grid/Grid'
let _grid = Grid.getInstance()

export const UnitUtils = function() {
  var instance = null

  function createUtils() {
    //___________________________________________________________________________
    function isPositionAvaliable(position, units) {
      let isAvailable = true
      if(_grid.suggestedPositionIsAnObstacleCell(position)) {
        return false
      }
      units.forEach((tank, index) => {
        if(tank.position.x === position.x && tank.position.y === position.y) {
          isAvailable = false
        }
      })

      return isAvailable
    }
    //___________________________________________________________________________
    function getRandomPosition(units) {
      let columns = _grid.getCols()
      let rows = _grid.getRows()
      return {
        x: Math.floor(Math.random() * columns),
        y: Math.floor(Math.random() * rows)
      }
    }
    //___________________________________________________________________________
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
    //___________________________________________________________________________
    function getTankUnit(tankPosition, units) {
      // Colors
      let baseBlue    = '#131313'
      let baseRed     = '#131313'
      let cabinBlue   = '#32237d'
      let cabinRed    = '#7d2333'
      let cannonBlue  = '#6262da'
      let cannonRed   = '#d61818'

      let baseColor   = units.length % 2 ? baseBlue : baseRed
      let cabinColor  = units.length % 2 ? cabinBlue : cabinRed
      let cannonColor = units.length % 2 ? cannonBlue : cannonRed

      let randomize = false

      return {
        id:           units.length,
        aimTarget:    {x: 0, y: 0},
        position:     tankPosition,
        width:        randomize ? Math.floor(Math.random() * 45) + 40 : 35,
        height:       randomize ? Math.floor(Math.random() * 50) + 45 : 50,
        cannonSize:   randomize ? Math.floor(Math.random() * 100) + 70 : 70,
        background:   baseColor,
        cabineColor:  cabinColor,
        cannonColor:  cannonColor,
        rotate:       'true',
        selected:     false,
        angle:        0
      }
    }

    return {
      getRandomPos: getRandomPos,
      getTankUnit: getTankUnit
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
