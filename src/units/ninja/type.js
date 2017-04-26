import * as TYPES from '../types/unitTypes'

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
export const NinjaType = function() {
  // Type
  this.type        = TYPES.NINJA_TYPE
  // A* category
  this.aStarStyle  = 'basic'
  // Rotate aim duration
  this.aimDuration = 200
  // Movement speed
  this.moveSpeed   = 1000
  // id tracker
  this.idTrack     = ''

  // Id & position
  this.id          = null
  this.position    = null
  this.shouldRotate = true
  // cell width height properties
  this.cellWidth   = 100
  this.cellHeight  = 100
  // mass
  this.mass        = 100
  // hit points
  this.hitPoints   = 4
  this.hpPosTop    = 20
  // status
  this.alive       = true

  this.allowMovement = true
  this.animationCells = []
  this.animationTimeOuts = []

  this.setId = function(id) {
    this.id = id
  }

  this.setPosition = function(position) {
    this.position = position
  }

  this.break = function() {
    console.warn('unit break!')
    this.allowMovement = false
    this.animationCells = []
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
      rotate:         this.shouldRotate,
      selected:       false,
      angle:          0,
      mass:           this.mass,
      hp:             this.hitPoints,
      hpPosTop:       this.hpPosTop,
      alive:          this.alive,
      allowMovement:    this.allowMovement,
      break:            this.break,
      animationCells:   this.animationCells,
      animationTimeOuts:this.animationTimeOuts
    }
  }
}
