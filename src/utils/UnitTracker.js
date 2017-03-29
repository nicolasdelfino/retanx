import $ from "jquery";

export const UnitTracker = function() {

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
      console.group('TRACKING')
      units.forEach((unit, index) => {
        let element = $('#unit_' + unit.id + " .position");
        let x = Math.floor(element.offset().left) - mainX - unit.offset.x
        let y = Math.floor(element.offset().top) - mainY - unit.offset.y

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
