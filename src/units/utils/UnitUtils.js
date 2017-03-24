import { Grid } from '../../grid/Grid'
import * as TYPES from '../types/unitTypes'
let _grid = Grid.getInstance()

// TYPES
import { TankType } from '../tank/type'

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
    function getUnit(unitType, unitPosition, units) {
      let unit = null
      switch (unitType) {
        case TYPES.TANK_TYPE:
          unit = getTankUnit(unitPosition, units)
          break;
        case TYPES.SOLDIER_TYPE:
          unit = getTankUnit(unitPosition, units)
          break;
        default:
          unit = getTankUnit(unitPosition, units)
      }
      return unit
    }
    //___________________________________________________________________________
    function getTankUnit(unitPosition, units) {
      let tank = new TankType()

      // id
      tank.setId(units.length)

      // position
      tank.setPosition(unitPosition)

      // color
      let baseColor   = units.length % 2 ? tank.baseBlue : tank.baseRed
      let cabinColor  = units.length % 2 ? tank.cabinBlue : tank.cabinRed
      let cannonColor = units.length % 2 ? tank.cannonBlue : tank.cannonRed
      tank.setColors(baseColor, cabinColor, cannonColor)

      return tank.getUnit()
    }

    //___________________________________________________________________________
    // PUBLIC
    //___________________________________________________________________________
    return {
      getRandomPos: getRandomPos,
      getUnit: getUnit,
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
