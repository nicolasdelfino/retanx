import $ from "jquery";

export const UnitWorldPositionTracker = function() {

  let instance = null

  function createUnitTracker() {
    let units = []

    function getBankersRounding(value) {
      var intVal   = Math.floor(value);
      var floatVal = value % 1;
      if (floatVal !== 0.5) {
          return Math.round(value);
      } else {
        if (intVal % 2 === 0) {
            return intVal;
        } else {
            return intVal + 1;
        }
      }
    }

    //getters
    function trackUnits(activeUnit) {
      if(units.length === 0) {
        return
      }

      let main = $('.main')
      let mainX = Math.floor(main.offset().left)
      let mainY = Math.floor(main.offset().top)
      console.group('U.W.P TRACKER')
      let tU = units.length < 2 ? 'UNIT' : 'UNITS'
      console.log('Tracking ' + units.length + ' ' + tU)

      let movingUnits = []
      units.forEach((unit, index) => {

        let element = $('#unit_' + unit.id + " .position"); // NO JQUERY PLEASE

        let xx = Math.floor(element.offset().left) - Math.floor(mainX)
        let yy = Math.floor(element.offset().top) - Math.floor(mainY)

        //https://en.wikipedia.org/wiki/Rounding#Round_half_to_even
        let x = getBankersRounding(xx / 100)
        let y = getBankersRounding(yy / 100)

        let isActive = false
        if(index === activeUnit) {
          isActive = true
          // console.group('%c *** ACTIVE UNIT ***', 'background: #000; color: #bada55');
          console.log('%c**', 'background: #000; color: #bada55', '#unit_' + unit.id, '=> x:', x, 'y:', y)
          // console.groupEnd()
        }
        else {
          console.log('#unit_' + unit.id, '=> x:', x, 'y:', y)
        }

        movingUnits.push({id:unit.id, active: isActive, x: x, y: y})
      })
      console.groupEnd()

      return movingUnits
    }

    //setters
    function turnOn() {
      this.isOn = true
    }
    function turnOff() {
      this.isOn = false
    }
    function setUnits(val) {
      units = val
    }

    return {
        setUnits: setUnits,
        trackUnits: trackUnits,
        turnOn: turnOn,
        turnOff: turnOff
    }
  }

  return {
      getInstance: function() {
        if(!instance) {
           instance = createUnitTracker();
        }
        return instance;
     }
  }
}()
