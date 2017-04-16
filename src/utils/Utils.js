////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
export const Utils = function() {
  let instance = null

  function createUtils() {
    //_____________________________________________________________________________________________________
    function getTotalDivs() {
      return document.getElementsByTagName('div').length
    }

    // scroll
    const easeInOut = (currentTime, start, change, duration) => {
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return change / 2 * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    }

    function scrollTo(element, to, duration) {
      let start = element.scrollTop,
          change = to - start,
          increment = 20;

      const animateScroll = (elapsedTime) => {
          elapsedTime += increment;
          var position = easeInOut(elapsedTime, start, change, duration);
          element.scrollTop = position;
          if (elapsedTime < duration) {
              setTimeout(function() {
                  animateScroll(elapsedTime);
              }, increment);
          }
      };

      animateScroll(0);
    }
    //_____________________________________________________________________________________________________
    function getAimDegrees(tank, aimTarget) {
      let position = tank.position
      let p1 = {
        x: aimTarget.x,
        y: aimTarget.y
      }
      let p2 = {
        x: position.x,
        y: position.y
      }

      let deltaX = p2.x - p1.x
      let deltaY = p2.y - p1.y
      var angle = Math.atan2(deltaX, deltaY) * (180.0 / Math.PI);
      let a =  Math.abs(180 - ( angle ))

      //Adjust angle to take the closest turn (eg if current tank angle is 0 and new angle should be 270, go -90 instead)
      if (a < 0) a += 360;
      if (a > 360) a -= 360;
      if (a - tank.angle > 180) a -= 360;
      if (a - tank.angle < -180) a += 360;
      return a
    }

    return {
        getTotalDivs: getTotalDivs,
        scrollTo: scrollTo,
        getAimDegrees: getAimDegrees
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
