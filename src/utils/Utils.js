import $ from "jquery";

export const Utils = function() {

  let instance = null

  function createUtils() {

    //setters
    function getTotalDivs() {
      //let divs = $('div')
      //debugger;
      let a = document.getElementsByTagName('div').length
      //let c = document.querySelectorAll('div')


      //let b = 0
      //a[0].forEach(a => {
      //  b++
      //})

      return a
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
