import React, { Component } from 'react'
import { connect } from 'react-redux'
import Ground from '../../grid/Ground'

// Grid and aStar
import { AStar } from '../../grid/AStar'
import { Grid } from '../../grid/Grid'
let _grid = null

// Position tracker
import { UnitWorldPositionTracker } from './UnitWorldPositionTracker'
let tracker = UnitWorldPositionTracker.getInstance()
let trackerInterval = null

// Collision manager
import { WorldCollision } from './WorldCollision'
let collisionManager = WorldCollision.getInstance()

// Generic Utils
import { Utils } from '../../utils/Utils'
let utils = Utils.getInstance()

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
class UC extends Component {
  constructor(props) {
    super(props)
    this.animationTimer = null
    this.moveTimer = null
    this.shootingTimer = null
    this.state = {
      isAiming: false,
      isFollowingPath: true,
      forceValUpdate: 0,
      shooting: false,
      refresh: 0,
      totalDivs: 0
    }
  }
  //_____________________________________________________________________________________________________
  componentDidMount() {
    _grid = Grid.getInstance()
  }

  //_____________________________________________________________________________________________________
  // Follow path function, cuts out redundant cells
  followPath(moveUnit, start, path) {

    // track the position of units when something is moving
    let units     = this.props.units

    clearInterval(trackerInterval)
    trackerInterval = setInterval(() => {

      if(units.length === 1) {
        return
      }
      //_____________________________________________________________________________________________________
      // UNIT COLLISIONS
      let roadKill = collisionManager.trackCollisions(tracker.trackUnits(units, moveUnit.id))
      if(roadKill) {
        if(units[roadKill.id].alive) {
          console.warn('%cROADKILL', 'color:red', roadKill)
          let killedUnit = units[roadKill.id]
          killedUnit.alive = false
          _grid.getGrid()[killedUnit.position.x][killedUnit.position.y].unitObstacle = false
          this.setState({ forceValUpdate: this.state.forceValUpdate + 1 })
        }
      }
    }, 100)

    path.reverse()

    let end = path[path.length -1]
    let animationCells = []

    clearTimeout(this.animationTimer)

    for(let i = 0; i < path.length; i ++) {
      if(i > 0 && i < path.length -1) {
        let current = path[i]
        let previous = path[i -1]
        let next = path[i +1]
        if(previous.x !== next.x && previous.y !== next.y) {
          current.isAnimationCell = true
          current.animOrgIndex = i
          animationCells.push(current)
        }
      }
    }

    end.animOrgIndex = path.length -1
    animationCells.push(end)

    //_____________________________________________________________________________________________________
    // Put animation on unit
    moveUnit.animationCells = animationCells

    //_____________________________________________________________________________________________________
    // Animate path

    moveUnit.animationCells.forEach((item, index) => {

      item.tempPathString = index
      let delay = index * (moveUnit.moveSpeed + moveUnit.aimDuration)

      moveUnit.animationTimeOuts.push(setTimeout(() => {
        let position = {
          x: item.y,
          y: item.x
        }

        if(!this.props.units[moveUnit.id].allowMovement) {
          this.resetUnitMovement(moveUnit)
          return
        }
        // used for controlling walk animation
        this.props.dispatch({ type: 'STOP_MOVING' })

        // aim cannon
        this.props.dispatch({type: 'AIM', payload: {
          id: moveUnit.id,
          target: position,
          angle: utils.getAimDegrees(this.props.units[moveUnit.id], { x: position.y, y: position.x }) }
        })

        _grid.getGrid()[moveUnit.position.x][moveUnit.position.y].opacity = 1

        //get cells between this one and last non animation cell
        this.makeFOW(path, item.animOrgIndex)

        // move unit
        setTimeout(() => {

          // this.setState({ isMoving: true })
          this.props.dispatch({ type: 'START_MOVING' })

          this.props.dispatch({type: 'MOVE', payload: {id: moveUnit.id, target: position}})

          this.makeFOW(path, item.animOrgIndex)

          // check if animation end
          if(index === moveUnit.animationCells.length -1) {
            // TODO add travel duration (this.getSpeed())
            moveUnit.animationCells[index].opacity = 1

            setTimeout(() => {
              this.props.dispatch({ type: 'STOP_MOVING' })

              // stop tracking unit positions
              clearInterval(trackerInterval)
              console.log('** Unit arrived at target cell **')

              this.props.dispatch({ type: 'STOP_ANIMATING' })
            }, moveUnit.moveSpeed)
          }

        }, moveUnit.aimDuration)

      }, delay))
    })

    this.setState({ forceValUpdate: this.state.forceValUpdate + 1 })
  }
  //_____________________________________________________________________________________________________
  // F.O.W.
  makeFOW(p, animOrgIndex) {
    for(var c = 0; c < p.length; c++) {
      let tCell = p[c]
      if(c <= animOrgIndex) {
        setTimeout(() => {
          tCell.reveal()
        }, c * 10)
      }
    }
  }
  //_____________________________________________________________________________________________________
  resetUnitMovement(moveUnit) {
    clearInterval(trackerInterval)
    clearTimeout(this.animationTimer)
    clearTimeout(this.moveTimer)

    for (var i = 0; i < moveUnit.animationTimeOuts.length; i++) {
        clearTimeout(moveUnit.animationTimeOuts[i]);
    }
    this.props.units[moveUnit.id].allowMovement = true

    // this.setState({ isMoving: false, isAnimating: false })

    this.props.dispatch({ type: 'STOP_MOVING' })
    this.props.dispatch({ type: 'STOP_ANIMATING' })
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Move to cell

  moveToCell(cell) {
    if(!this.props.units[this.props.currentSelectionID].selected) {
      return null
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // A* - Wikipedia source: https://en.wikipedia.org/wiki/A*_search_algorithm
    //////////////////////////////////////////////////////////////////////////////////////////

    let unit  = this.props.units[this.props.currentSelectionID]
    let start = _grid.getGrid()[unit.position.x][unit.position.y]
    let end   = _grid.getGrid()[cell.y][cell.x]

    // make sure that start cell isn´t a wall
    start.obstacle = false
    // start.showObstacle = false

    let path = AStar(_grid, start, end, this.props.units, unit.id)
    console.log('A* path', path)

    if(path.length === 0) {
      console.warn('No a * solution found')

      // aim cannon
      this.props.dispatch({type: 'AIM', payload: {
        id: unit.id,
        target: cell,
        angle: utils.getAimDegrees(this.props.units[this.props.currentSelectionID], {x:cell.y, y:cell.x }) }})

      return
    }

    // follow shortest path to destination
    this.followPath(unit, start, path)

    // this.setState({isAnimating: true})
    this.props.dispatch({ type: 'START_ANIMATING' })

    // No A*, just click and move (bird path)
    let autoMove = false
    if(autoMove) {
      // Clear aim time each time a new aim action is called (takes 1 second to aim)
      clearTimeout(this.animationTimer)
      // Move cannon action (aim)
      this.props.dispatch({type: 'AIM', payload: {id: this.props.units[this.props.currentSelectionID].id, target: cell } })
      this.setState({ isAiming: true })

      // Wait for aim animation to finish
      this.animationTimer = setTimeout(() => {
        this.setState({ isAiming: false })
        this.props.dispatch({type: 'MOVE', payload: {id: this.props.units[this.props.currentSelectionID].id, target: cell}})
      }, 500)
    }
  }
  //_____________________________________________________________________________________________________
  renderGround() {
    if(this.props.units.length === 0) {
      return null
    }

    let sel = false
    this.props.units.forEach((tank) => {
      if(tank.selected) {
        sel = true
      }
    })
    return (
      <Ground debugObstacles={this.props.debugObstacles} debug={this.props.debugMode} ascores={this.props.debugAstarScores} units={this.props.units} cursor={sel ? 'crosshair' : 'normal'}
      aim={this.aimOnCell.bind(this)} move={this.moveToCell.bind(this)}/>
    )
  }
  //_____________________________________________________________________________________________________
  aimOnCell(cell) {
    if(!this.props.units[this.props.currentSelectionID].selected) {
      return null
    }
    // aim cannon
    this.props.dispatch({type: 'AIM', payload: {id: this.props.units[this.props.currentSelectionID].id, target: cell, angle: utils.getAimDegrees(this.props.units[this.props.currentSelectionID], {x:cell.y, y:cell.x }) } })
  }

  render() {
    return <div>{this.renderGround()}</div>
  }
}

const MSTP = (state) => {
	return {
    units: state.unitReducer.units,
    app: state.app,
    currentSelectionID: state.app.currentSelectionID,
    debugMode: state.app.debugMode,
    aimMode: state.app.aimMode,
    debugAstarScores: state.app.debugAstarScores,
    debugObstacles: state.app.debugObstacles,
    zoom: state.app.zoom,
    cameraRotation: state.app.cameraRotation
  }
}

const UnitController = connect(MSTP, null)(UC)

export default UnitController
