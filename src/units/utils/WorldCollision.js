export const WorldCollision = function() {

  let instance = null

  function createWorldCollision() {

    //getters
    function trackCollisions(arr) {

    }

    //setters

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
