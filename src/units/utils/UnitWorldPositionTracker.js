export const UnitWorldPositionTracker = function() {

  let instance = null

  function createUnitTracker() {

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
    function trackUnits(allUnits, activeUnit) {
      // get live ones
      let liveUnits = allUnits.filter((unit) => {
        return unit.alive === true
      })

      if(liveUnits.length <= 1) {
        return
      }

      const log     = true
      let main      = document.querySelectorAll('#board')
      let mainRect  = main[0].getBoundingClientRect();
      let mainX     = Math.floor(mainRect.left + document.body.scrollLeft)
      let mainY     = Math.floor(mainRect.top + document.body.scrollTop)
      if(log) {
        console.group('U.W.P TRACKER')
      }
      let tU = liveUnits.length < 2 ? 'UNIT' : 'UNITS'
      if(log) {
        console.log('Tracking ' + liveUnits.length + ' ' + tU)
      }

      let movingUnits = []
      liveUnits.forEach((unit, index) => {

        let element     = document.querySelectorAll('#unit_' + unit.id + ' .position')
        let rect        = element[0].getBoundingClientRect();
        let offsetTop   = rect.top + document.body.scrollTop
        let offsetLeft  = rect.left + document.body.scrollLeft


        let xx = Math.floor(offsetLeft) - Math.floor(mainX)
        let yy = Math.floor(offsetTop) - Math.floor(mainY)

        //https://en.wikipedia.org/wiki/Rounding#Round_half_to_even
        let x = getBankersRounding(xx / 100)
        let y = getBankersRounding(yy / 100)

        let isActive = false
        if(index === activeUnit) {
          isActive = true
          if(log) {
            console.log('%c**', 'background: #000; color: #bada55', '#unit_' + unit.id, '=> x:', x, 'y:', y)
          }
        }
        else {
          if(log) {
            console.log('#unit_' + unit.id, '=> x:', x, 'y:', y)
          }
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

    return {
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
