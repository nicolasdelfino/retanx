export const WorldCollision = function() {

  let instance = null

  function createWorldCollision() {

    function trackCollisions(movingUnits) {

      let collisionUnitId = null

      let movementX = movingUnits.map(function(unitPosition){ return unitPosition.x });
      let collisionX = movementX.some(function(pos, x){
          if(movementX.indexOf(pos) !== x) {
            return true
          }
          return false
      });

      let movementY = movingUnits.map(function(unitPosition){ return unitPosition.y });
      let collisionY = movementY.some(function(pos, y){
        if(movementY.indexOf(pos) !== y) {
          return true
        }
        return false
      });

      if(collisionX && collisionY) {
        console.warn('%ccollision', 'color:red')
      }
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
