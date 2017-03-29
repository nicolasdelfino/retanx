import $ from "jquery";

export const UnitTracker = function() {

  let instance = null

  function createUnitTracker() {
    let units = []

    //getters
    function getUnits() {
      // console.log('units', this.units)
      if(this.units.length === 0) {
        return
      }

      let main = $('.main')
      let mainX = Math.floor(main.offset().left)
      let mainY = Math.floor(main.offset().top)

      this.units.forEach((unit, index) => {
        let element = $('#unit_' + unit + " .position");

        let x = Math.floor(element.offset().left) - mainX - 35
        let y = Math.floor(element.offset().top) - mainY - 27

        console.log('#unit_' + unit, 'x:', x, 'y:', y)
      })
    }

    //setters
    function turnOn() {
      this.isOn = true
    }
    function turnOff() {
      this.isOn = false
    }
    function setUnits(val) {
      this.units = val
    }

    return {
        setUnits: setUnits,
        getUnits: getUnits,
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
