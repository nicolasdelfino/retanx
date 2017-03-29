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
      console.group('UNIT TRACKER')
      let tU = units.length < 2 ? 'UNIT' : 'UNITS'
      console.log('Tracking ' + units.length + ' ' + tU)
      units.forEach((unit, index) => {

        //let element = $('#unit_' + unit.id + " .position"); // NO JQUERY PLEASE
        let element = document.getElementById('unit_' + unit.id)
        element = element.getElementsByClassName('position')

        let x = parseInt(element[0].style.left) - mainX - unit.offset.x
        let y = parseInt(element[0].style.top) - mainY - unit.offset.y

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
