////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
export const WorldCollision = function() {

  let instance = null
  //_____________________________________________________________________________________________________
  function createWorldCollision() {
    //_____________________________________________________________________________________________________
    function trackCollisions(movingUnits) {

      if(!movingUnits) {
        return
      }

      if(movingUnits.length <= 1) {
        return
      }

      let collideUnit
      movingUnits.forEach((unit, index) => {
        movingUnits.forEach((compare, index) => {
          if(unit.active
            && !compare.active
            && compare.id !== unit.id
            && compare.x === unit.x
            && compare.y === unit.y) {
            collideUnit = compare
          }
        })
      })

      if(collideUnit) {
        // console.warn('%ccollideUnit', 'color:red', collideUnit)
        return collideUnit
      }
      return false
    }

    return {
        trackCollisions: trackCollisions
    }
  }

  return {
      getInstance: function() {
        if(!instance) {
           instance = createWorldCollision();
        }
        return instance;
     }
  }
}()
