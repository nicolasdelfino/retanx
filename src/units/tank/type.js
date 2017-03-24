import * as TYPES from '../types/unitTypes'

export const TankType = function() {
  // Type
  this.type        = TYPES.TANK_TYPE
  // A* category
  this.aStarStyle  = 'basic'
  // Rotate aim duration
  this.aimDuration = 600
  // Colors
  this.baseBlue    = '#131313'
  this.baseRed     = '#131313'
  this.cabinBlue   = '#32237d'
  this.cabinRed    = '#7d2333'
  this.cannonBlue  = '#6262da'
  this.cannonRed   = '#d61818'
  this.baseColor   = null
  this.cabinColor  = null
  this.cannonColor = null
  // Id & position
  this.id          = null
  this.position    = null
  // Randomize colors
  let randomize    = false

  this.setId = function(id) {
    this.id = id
  }

  this.setPosition = function(position) {
    this.position = position
  }

  this.setColors = function(baseColor, cabin, cannon) {
    this.baseColor    = baseColor
    this.cabinColor   = cabin
    this.cannonColor  = cannon
  }

  this.getUnit = function() {
    return {
      id:           this.id,
      type:         this.type,
      position:     this.position,
      aimTarget:    {x: 0, y: 0},
      aimDuration:  this.aimDuration,
      aStarStyle:   this.aStarStyle,
      width:        randomize ? Math.floor(Math.random() * 45) + 40 : 35,
      height:       randomize ? Math.floor(Math.random() * 50) + 45 : 50,
      cannonSize:   randomize ? Math.floor(Math.random() * 100) + 70 : 70,
      background:   this.baseColor,
      cabineColor:  this.cabinColor,
      cannonColor:  this.cannonColor,
      rotate:       'true',
      selected:     false,
      angle:        0
    }
  }
}
