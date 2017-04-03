import * as TYPES from '../types/unitTypes'

export const TankType = function() {
  // Type
  this.type        = TYPES.TANK_TYPE
  // A* category
  this.aStarStyle  = 'basic'
  // Rotate aim duration
  this.aimDuration = 600
  // Movement speed
  this.moveSpeed   = 2000
  // Colors
  this.baseBlue    = '#131313'
  this.baseRed     = '#131313'
  this.cabinBlue   = '#32237d'
  this.cabinRed    = '#9d0000'
  this.cannonBlue  = '#6262da'
  this.cannonRed   = '#de0000'
  this.baseColor   = null
  this.cabinColor  = null
  this.cannonColor = null
  // Id & position
  this.id          = null
  this.position    = null
  // cell width height properties
  this.cellWidth   = 100
  this.cellHeight  = 100
  // mass
  this.mass        = 1000
  // hit points
  this.hitPoints   = 12
  this.hpPosTop    = 0
  // status
  this.alive       = true

  this.range       = 5
  this.health      = 1000
  this.maxHealth   = 1000

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
      moveSpeed:    this.moveSpeed,
      aimDuration:  this.aimDuration,
      aStarStyle:   this.aStarStyle,
      width:        randomize ? Math.floor(Math.random() * 45) + 40 : 30,
      height:       randomize ? Math.floor(Math.random() * 50) + 45 : 45,
      cannonSize:   randomize ? Math.floor(Math.random() * 100) + 70 : 70,
      cellWidth:    this.cellWidth,
      cellHeight:   this.cellHeight,
      background:   this.baseColor,
      cabineColor:  this.cabinColor,
      cannonColor:  this.cannonColor,
      rotate:       'true',
      selected:     false,
      angle:        0,
      mass:         this.mass,
      hp:           this.hitPoints,
      hpPosTop:     this.hpPosTop,
      alive:        this.alive,
      range:        this.range,
      health:       this.health,
      maxHealth:    this.maxHealth
    }
  }
}
