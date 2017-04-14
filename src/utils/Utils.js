export const Utils = function() {
  let instance = null

  function createUtils() {

    function getTotalDivs() {
      return document.getElementsByTagName('div').length
    }

    /////////////////////////////////////////////////////////////////////////////
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


    return {
        getTotalDivs: getTotalDivs,
        scrollTo: scrollTo
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
