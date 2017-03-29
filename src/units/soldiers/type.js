import * as TYPES from '../types/unitTypes'

export const SoldierType = function() {
  // Type
  this.type        = TYPES.SOLDIER_TYPE
  // A* category
  this.aStarStyle  = 'advanced'
  // Rotate aim duration
  this.aimDuration = 200
  // Movement speed
  this.moveSpeed   = 4000
  // id tracker
  this.idTrack     = ''
  // Colors
  this.torsoColor     = '#'
  this.shoulderColor  = '#'
  this.armsColor      = '#'
  this.headColor      = '#'
  this.weaponColor    = '#'
  this.barrelColor    = '#'
  // Id & position
  this.id          = null
  this.position    = null
  // cell width height properties
  this.cellWidth   = 100
  this.cellHeight  = 100

  this.setId = function(id) {
    this.id = id
  }

  this.setPosition = function(position) {
    this.position = position
  }

  this.setColors = function(torso, shoulders, arms, head, weapon, barrel) {
    this.torsoColor     = torso
    this.shoulderColor  = shoulders
    this.armsColor      = arms
    this.headColor      = head
    this.weaponColor    = weapon
    this.barrelColor    = barrel
  }

  this.getUnit = function() {
    return {
      id:             this.id,
      type:           this.type,
      position:       this.position,
      aimTarget:      {x: 0, y: 0},
      moveSpeed:      this.moveSpeed,
      aimDuration:    this.aimDuration,
      aStarStyle:     this.aStarStyle,
      width:          20,
      height:         20,
      cellWidth:      this.cellWidth,
      cellHeight:     this.cellHeight,
      outlineWidth:   20,
      outlineHeight:  20,
      torsoColor:     this.torsoColor,
      shoulderColor:  this.shoulderColor,
      armsColor:      this.armsColor,
      headColor:      this.headColor,
      weaponColor:    this.weaponColor,
      barrelColor:    this.barrelColor,
      rotate:         'true',
      selected:       false,
      angle:          0,
      offsetPX:       this.offsetPX,
      offsetPY:       this.offsetPY
    }
  }
}
