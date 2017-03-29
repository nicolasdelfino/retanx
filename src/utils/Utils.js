export const Utils = function() {
  let instance = null

  function createUtils() {

    function getTotalDivs() {
      return document.getElementsByTagName('div').length
    }

    return {
        getTotalDivs: getTotalDivs
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
