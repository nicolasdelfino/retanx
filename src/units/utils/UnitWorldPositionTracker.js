import $ from "jquery";

export const UnitWorldPositionTracker = function() {

  let instance = null

  function createUnitTracker() {
    let units = []

    //getters
    function trackUnits() {
      if(units.length === 0) {
        return
      }

      let main = $('.main')
      let mainX = Math.floor(main.offset().left)
      let mainY = Math.floor(main.offset().top)
      console.group('UNIT TRACKER')
      let tU = units.length < 2 ? 'UNIT' : 'UNITS'
      console.log('Tracking ' + units.length + ' ' + tU)
      units.forEach((unit, index) => {

        let element = $('#unit_' + unit.id + " .position"); // NO JQUERY PLEASE

        let x = Math.floor(element.offset().left) - Math.floor(mainX)
        let y = Math.floor(element.offset().top) - Math.floor(mainY)

        console.log('#unit_' + unit.id, '=> x:', x, 'y:', y)
      })
      console.groupEnd()
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
