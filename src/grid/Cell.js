export const Cell = function(Dimensions) {
  this.x      = 0
  this.y      = 0
  this.f      = 0
  this.g      = 0
  this.h      = 0
  this.cols   = Dimensions.width / Dimensions.tileSize
  this.rows   = Dimensions.height / Dimensions.tileSize

  // AStar
  this.neighbors  = []
  this.previous   = undefined
  this.isPath     = false

  // animation
  this.isPathDirectionTurn  = false
  this.tempPathString       = ''
  this.animOrgIndex         = null
  this.opacity              = 0

  // obstacle props
  this.obstacle       = false
  this.unitObstacle   = false
  this.showRuins      = false
  this.indestructable = false

  // tile sprite
  this.cssClass       = ''

  // random obstacles
  //_________________________________________________________
  // if((Math.floor(Math.random() * 100) + 1) < 22) {
  //   this.obstacle = true
  //   this.showObstacle = true
  //   this.diffCell = true
  // }

  this.reveal = function(fullReveal) {
    this.opacity = 1
    this.neighbors.forEach((neighbor) => {
        neighbor.opacity += fullReveal ? 1 : 0.5
    })
  }

  this.setType = (type) => {
    if(type === 'obstacle'){
      this.cssClass = 'tileObstacle'
      this.obstacle = true
    }
    else if(type === 'wall'){
      this.cssClass       = 'tileWall'
      this.obstacle       = true
      this.indestructable = true
    }
  }

  this.addNeighbors = (grid, aStarStyle) => {
    let _x = this.x
    let _y = this.y

    this.addDefaultNeighbors(grid, _x, _y)

    if(aStarStyle === 'advanced') {
      this.addDiagonalNeighbors(grid, _x, _y)
    }
  }

  this.addDefaultNeighbors = (grid, _x, _y) => {
    if(_x < this.cols - 1) {
      this.neighbors.push(grid[_x + 1][_y])
    }
    if(_x > 0) {
      this.neighbors.push(grid[_x - 1][_y])
    }
    if(_y < this.rows - 1) {
      this.neighbors.push(grid[_x][_y + 1])
    }
    if(_y > 0) {
      this.neighbors.push(grid[_x][_y -1])
    }
  }

  this.addDiagonalNeighbors = (grid, _x, _y) => {
    if(_x > 0 && _y > 0) {
      this.neighbors.push(grid[_x - 1][_y - 1])
    }
    if(_x < this.cols - 1 && _y > 0) {
      this.neighbors.push(grid[_x + 1][_y - 1])
    }
    if(_x > 0 && _y < this.rows - 1) {
      this.neighbors.push(grid[_x - 1][_y + 1])
    }
    if(_x < this.cols - 1 && _y > 0) {
      this.neighbors.push(grid[_x + 1][_y - 1])
    }
  }

  this.reset = () => {
    this.f = 0
    this.g = 0
    this.h = 0
    this.neighbors = []
    this.previous = undefined
    this.isPath = false
    this.isPathDirectionTurn = false
    this.tempPathString = ''
    //this.animOrgIndex = null
    this.unitObstacle = false
  }
}
