import $ from "jquery";

export const Utils = function() {

  let instance = null

  function createUtils() {

    //setters
    function getTotalDivs() {
      
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
