import React, { Component } from 'react'
import { connect } from 'react-redux'
import sound_pew from '../assets/pew.mp3'
import sound_explosion from '../assets/explosion.mp3'

// Grid and aStar
import { Grid } from '../grid/Grid'
let _grid = null


////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
class IC extends Component {

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
  startShooting() {
    this.props.dispatch({ type: 'START_SHOOTING' })
  }
  //_____________________________________________________________________________________________________
  stopShooting() {
    this.props.dispatch({ type: 'STOP_SHOOTING' })
  }
  //_____________________________________________________________________________________________________
  handleKeyInput() {
    document.body.onkeydown = (e) => {
        if(e.keyCode === 65 && this.props.currentSelectionID !== null){
            if(!this.props.shooting && this.props.units[this.props.currentSelectionID].selected) {
              this.startShooting()
              this.handleShotFired()
              this.shootingTimer = setInterval(() => { this.handleShotFired(); }, 300)
            }
        }
        else if(e.keyCode === 83) {
          if(this.props.isAnimating) {
            console.warn('STOP ASTAR', this.props.isMoving)
            this.stopMovement()
          }
        }
    }
    document.body.onkeyup = (e) => {
        if(e.keyCode === 65){
            this.stopShooting()
            clearInterval(this.shootingTimer)
        }
    }
  }
  //_____________________________________________________________________________________________________
  // Cancel movement
  stopMovement() {
    this.props.units[this.props.currentSelectionID].break()
    this.setState({ forceValUpdate: this.state.forceValUpdate + 1 })
  }
  //_____________________________________________________________________________________________________
  handleShotFired() {
    //Pew
    (new Audio(sound_pew)).play();

    //Calculate target area
    let beamWidth = 0.5/2;
    let tank = this.props.units[this.props.currentSelectionID];
    let targetArea = [[
        tank.position.x + 0.5 + (beamWidth * Math.sin((tank.angle + 90) * (Math.PI / 180))),
        tank.position.y + 0.5 + (beamWidth * Math.cos((tank.angle + 90) * (Math.PI / 180)))
      ],[
        tank.position.x + 0.5 + (beamWidth * Math.sin((tank.angle - 90) * (Math.PI / 180))),
        tank.position.y + 0.5 + (beamWidth * Math.cos((tank.angle - 90) * (Math.PI / 180)))
      ]
    ];
    let range = 5;
    targetArea.push([
        targetArea[1][0] + -(range * Math.sin((tank.angle) * (Math.PI / 180))),
        targetArea[1][1] + (range * Math.cos((tank.angle) * (Math.PI / 180)))
    ]);
    targetArea.push([
        targetArea[0][0] + -(range * Math.sin((tank.angle) * (Math.PI / 180))),
        targetArea[0][1] + (range * Math.cos((tank.angle) * (Math.PI / 180)))
    ]);

    //Find obstacles within target area, and blow em up!
    let grid = _grid.getGrid()
    let rows = _grid.getRows()
    let cols = _grid.getCols()
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if (this.pointInPolygon(x+0.5, y+0.5, targetArea)) {

          let kill = false;
          let unit = this.props.units.find((unit) => { return (unit.position.x === x && unit.position.y === y); }); //Look for unit in current position
          if (unit) {
            if (unit.id === this.props.currentSelectionID) { //No friendly fire
              unit = null;
            } else {
              unit.health -= 100;
              if (unit.health <= 0) {
                kill = true;
              }
            }
          } else if (grid[x][y].obstacle && !grid[x][y].indestructable) {
            kill = true;
          }

          if (kill) {
            (new Audio(sound_explosion)).play();
            grid[x][y].isExploding = true;
            this.props.dispatch({ type: 'DEF' })

            setTimeout(() => {
              grid[x][y].isExploding = false;
              grid[x][y].obstacle = false;
              grid[x][y].showRuins = true;
              if (unit) {
                //TODO: Remove unit from state
              }
              console.log('DONE')
              this.props.dispatch({ type: 'DEF' })
            }, 400);
          }

        }
      }
    }
  }

  //https://github.com/substack/point-in-polygon
  pointInPolygon(x, y, polygon) {
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      var xi = polygon[i][0], yi = polygon[i][1];
      var xj = polygon[j][0], yj = polygon[j][1];
      var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  render() {
    return <div>{this.handleKeyInput()}</div>
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
    cameraRotation: state.app.cameraRotation,
    shooting: state.unitReducer.shooting,
    isMoving: state.unitReducer.isMoving,
    isAnimating: state.unitReducer.isAnimating
  }
}

const InputController = connect(MSTP, null)(IC)

export default InputController
