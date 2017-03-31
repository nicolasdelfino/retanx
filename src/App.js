import React from 'react';
import './css/App.css';
import { connect } from 'react-redux'
import Ground from './grid/Ground'
import BasePosition from './units/base/BasePosition'
import Body from './units/tank/components/Body'
import Cannon from './units/tank/components/Cannon'
import Tracks from './units/tank/components/Tracks'
import HealthBar from './units/tank/components/HealthBar'
import Outline from './units/base/Outline'
import SpecsView from './units/tank/components/SpecsView'
import FootSoldier from './units/soldiers/components/FootSoldier'
import * as TYPES from './units/types/unitTypes'

import sound_pew from './assets/pew.mp3'
import sound_explosion from './assets/explosion.mp3'
import logo from './retanx.png'

import { Dimensions, Grid } from './grid/Grid'
import { AStar } from './grid/AStar'
let _grid = null

import { UnitFactory } from './units/utils/UnitFactory'
let unitFactory = UnitFactory.getInstance()

import { UnitWorldPositionTracker } from './units/utils/UnitWorldPositionTracker'
let tracker = UnitWorldPositionTracker.getInstance()
let trackerInterval = null

import { Utils } from './utils/Utils'
let utils = Utils.getInstance()

const mainStyle = {
  width: Dimensions().width, height: Dimensions().height,
  color: '#fff',
  background: '#e8e8e8',
  position: 'relative',
  border: '0px solid #402c1b'
}

class MainConnect extends React.Component {

  constructor(props) {
    super(props)
    this.timer = null
    this.shootingTimer = null
    this.state = {
      isAiming: false,
      isMoving: false,
      isFollowingPath: true,
      forceValUpdate: 0,
      shooting: false,
      refresh: 0,
      totalDivs: 0
    }
  }

  componentDidMount() {
    _grid = Grid.getInstance()
    this.addUnit(TYPES.TANK_TYPE)

    setInterval(() => {
      this.setState({
        totalDivs: utils.getTotalDivs()
      })
    }, 1000)
  }

  addUnit(type) {
    if(!type) {
      // default to use tank type
      type = TYPES.TANK_TYPE
    }
    // currently just tanks
    let unitPosition = unitFactory.getRandomPos(this.props.units)

    if(!unitPosition) {
      console.log('No available position for unit')
      return
    }

    let unit = unitFactory.getUnit(type, unitPosition, this.props.units)
    this.props.dispatch({ type: 'ADD_UNIT', payload: unit})

    _grid.getGrid()[unitPosition.x][unitPosition.y].obstacle = false
    _grid.getGrid()[unitPosition.x][unitPosition.y].opacity = 1


  }

  toggleDebug() {
    this.props.dispatch({ type: 'TOGGLE_DEBUG' })
  }

  toggleAscores() {
    this.props.dispatch({ type: 'TOGGLE_ASCORES' })
  }

  toggleAim() {
    this.props.dispatch({ type: 'TOGGLE_AIM' })
  }

  coordinates(pos, width, height) {
    // console.log('pos', pos)
    let size = Dimensions().width / _grid.getDivider()
    return {
      x: pos.x * size + (size / 2 - width / 2),
      y: pos.y * size + (size / 2 - height / 2)
    }
  }

  aimDegrees(tank, aimTarget) {
    let position = tank.position
    let p1 = {
      x: aimTarget.x,
      y: aimTarget.y
    }
    let p2 = {
      x: position.x,
      y: position.y
    }

    let deltaX = p2.x - p1.x
    let deltaY = p2.y - p1.y
    var angle = Math.atan2(deltaX, deltaY) * (180.0 / Math.PI);
    let a =  Math.abs(180 - ( angle ))

    //Adjust angle to take the closest turn (eg if current tank angle is 0 and new angle should be 270, go -90 instead)
    if (a < 0) a += 360;
    if (a > 360) a -= 360;
    if (a - tank.angle > 180) a -= 360;
    if (a - tank.angle < -180) a += 360;
    return a
  }

  getSpeed(position) {
    // TODO TRAVEL SPEED
  }

  getIsThisUnitShooting(unit, id) {
    return (unit.selected) && (this.props.currentSelectionID === id) && (this.state.shooting) ? true : false
  }

  renderUnits() {
    let units     = this.props.units
    let unitList  = []

    units.forEach((unit, index) => {
      let shouldRotate  = unit.rotate
      let position      = unit.position
      let cellWidth     = unit.cellWidth
      let cellHeight    = unit.cellHeight
      let angle         = unit.angle
      let type          = unit.type
      let id            = unit.id

      if(type === TYPES.TANK_TYPE) {
        // cast as tank unit
        let tankUnit    = unit
        unitList.push(
          <div id={'unit_' + id} key={index}>
          <div style={{'cursor': 'pointer'}} onClick={() => {
            if(this.state.isAiming) { return }
            if(tankUnit.selected) {
              this.props.dispatch({type: 'DESELECT_UNIT', payload: {id: tankUnit.id }})
            }
            else {
              this.props.dispatch({type: 'SELECT_UNIT', payload: {id: tankUnit.id }})
              // deselect all other units
              this.props.dispatch({type: 'DESELECT_ALL_BUT_ID', payload: {id: tankUnit.id }})
            }
           }}>
            <BasePosition moveSpeed={tankUnit.moveSpeed} position={this.coordinates(position, cellWidth, cellHeight)} >
              <Body specs={tankUnit} speed={this.getSpeed(position)} rotate={shouldRotate} rotation={angle}>
                <Tracks specs={tankUnit}/>
              </Body>
              <HealthBar unit={tankUnit}/>
              <Cannon debugAim={this.props.aimMode}
              specs={tankUnit} rotate={shouldRotate}
              rotation={angle}
              shooting={this.getIsThisUnitShooting(tankUnit, index)}/>
            </BasePosition>
            <Outline moveSpeed={tankUnit.moveSpeed} specs={tankUnit} rotate={shouldRotate} position={this.coordinates(position, cellWidth, cellHeight)} rotation={angle}/>
            </div>
            <SpecsView specs={tankUnit}
            details={this.showSpecs.bind(this)}
            rotate={shouldRotate}
            position={this.coordinates(position, cellWidth, cellHeight)}
            rotation={angle}/>
          </div>
        )
      }
      else if(type === TYPES.SOLDIER_TYPE) {
        let soldierUnit = unit
        unitList.push(
          <div id={'unit_' + id} key={index}>
          <div style={{'cursor': 'pointer'}} onClick={() => {
            if(this.state.isAiming) { return }
            if(soldierUnit.selected) {
              this.props.dispatch({type: 'DESELECT_UNIT', payload: {id: soldierUnit.id }})
            }
            else {
              this.props.dispatch({type: 'SELECT_UNIT', payload: {id: soldierUnit.id }})
              // deselect all other units
              this.props.dispatch({type: 'DESELECT_ALL_BUT_ID', payload: {id: soldierUnit.id }})
            }
           }}>
              <BasePosition moveSpeed={soldierUnit.moveSpeed} position={this.coordinates(position, cellWidth, cellHeight)} >
                <FootSoldier
                isShooting={this.getIsThisUnitShooting(soldierUnit, index)}
                isMoving={this.state.isMoving} specs={soldierUnit}
                rotate={shouldRotate}
                rotation={angle}
                debugAim={this.props.aimMode}
                />
              </BasePosition>
              <Outline moveSpeed={soldierUnit.moveSpeed} specs={soldierUnit} rotate={shouldRotate} position={this.coordinates(position, cellWidth, cellHeight)} rotation={angle}/>
            </div>
            <SpecsView specs={soldierUnit}
            details={this.showSpecs.bind(this)}
            rotate={shouldRotate}
            position={this.coordinates(position, cellWidth, cellHeight)}
            rotation={angle}/>
          </div>
        )
      }
      else {
        return null
      }
    })
    return unitList
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Follow path function, cuts out redundant cells

  followPath(start, path) {

    // track the position of units when something is moving
    let units     = this.props.units
    let trackerUnits = units.map((unit) => {
      return {id: unit.id}
    })

    tracker.setUnits(trackerUnits)
    clearInterval(trackerInterval)
    trackerInterval = setInterval(() => {
      tracker.trackUnits(this.props.currentSelectionID)
    }, 250)

    path.reverse()

    let end = path[path.length -1]
    let animationCells = []

    clearTimeout(this.timer)

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

    //////////////////////////////////////////////////////////////////////////////////////////
    // Animate path

    animationCells.forEach((item, index) => {
      item.tempPathString = index
      let delay = index * (this.props.units[this.props.currentSelectionID].moveSpeed + this.props.units[this.props.currentSelectionID].aimDuration)
      this.timer = setTimeout(() => {
        let position = {
          x: item.y,
          y: item.x
        }

        // used for controlling walk animation
        this.setState({ isMoving: false })

        let unit = this.props.units[this.props.currentSelectionID]

        // aim cannon
        this.props.dispatch({type: 'AIM', payload: {
          id: this.props.units[this.props.currentSelectionID].id,
          target: position,
          angle: this.aimDegrees(this.props.units[this.props.currentSelectionID], { x: position.y, y: position.x }) }})


          _grid.getGrid()[unit.position.x][unit.position.y].opacity = 1

          //get cells between this one and last non animation cell
          this.makeFOW(path, item.animOrgIndex)

        // move unit
        setTimeout(() => {
          this.setState({ isMoving: true })
          this.props.dispatch({type: 'MOVE', payload: {id: this.props.units[this.props.currentSelectionID].id, target: position}})

          this.makeFOW(path, item.animOrgIndex)

          // check if animation end
          if(index === animationCells.length -1) {
            // TODO add travel duration (this.getSpeed())
            animationCells[index].opacity = 1

            setTimeout(() => {
              this.setState({ isMoving: false })
              // stop tracking unit positions
              clearInterval(trackerInterval)
              console.log('** Unit arrived at target cell **')
            }, this.props.units[this.props.currentSelectionID].moveSpeed)
          }

        }, this.props.units[this.props.currentSelectionID].aimDuration)

      }, delay)
    })

    this.setState({ forceValUpdate: this.state.forceValUpdate + 1 })
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // F.O.W.

  makeFOW(path, animOrgIndex) {
    for(var c = 0; c < path.length; c++) {
      let tCell = path[c]
      if(c <= animOrgIndex) {
        setTimeout(() => {
          tCell.focus()
        }, c * 10)
      }
    }
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
    start.showObstacle = false

    let path = AStar(_grid, start, end, this.props.units, this.props.currentSelectionID)
    console.log('A* path', path)

    if(path.length === 0) {
      console.warn('No a * solution found')

      // aim cannon
      this.props.dispatch({type: 'AIM', payload: {
        id: this.props.units[this.props.currentSelectionID].id,
        target: cell,
        angle: this.aimDegrees(this.props.units[this.props.currentSelectionID], {x:cell.y, y:cell.x }) }})

      return
    }

    // follow shortest path to destination
    this.followPath(start, path)

    // No A*, just click and move (bird path)
    let autoMove = false
    if(autoMove) {
      // Clear aim time each time a new aim action is called (takes 1 second to aim)
      clearTimeout(this.timer)
      // Move cannon action (aim)
      this.props.dispatch({type: 'AIM', payload: {id: this.props.units[this.props.currentSelectionID].id, target: cell } })
      this.setState({ isAiming: true })

      // Wait for aim animation to finish
      this.timer = setTimeout(() => {
        this.setState({ isAiming: false })
        this.props.dispatch({type: 'MOVE', payload: {id: this.props.units[this.props.currentSelectionID].id, target: cell}})
      }, 500)
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Aim, when clicking on obstacles

  aimOnCell(cell) {
    if(!this.props.units[this.props.currentSelectionID].selected) {
      return null
    }
    // aim cannon
    this.props.dispatch({type: 'AIM', payload: {id: this.props.units[this.props.currentSelectionID].id, target: cell, angle: this.aimDegrees(this.props.units[this.props.currentSelectionID], {x:cell.y, y:cell.x }) } })
  }

  showSpecs() {
    this.props.dispatch({type: 'SHOW_DETAIL_VIEW'})
  }

  hideSpecs() {
    this.props.dispatch({type: 'HIDE_DETAIL_VIEW'})
  }

  renderSpecsView() {
    const specsStyle = {
      display: 'flex',
      position: 'absolute', top:0, zIndex: 300,
      width: Dimensions().width, height: Dimensions().height,
      background: 'rgba(252, 27, 27, 0.5)',
      justifyContent: 'center', alignItems: 'center'
    }
    if(!this.props.app.detailsView) {
      return null
    }

    // let tank = this.props.units[this.props.currentSelectionID]
    return (
      <div style={{...specsStyle}}>
        <div style={{padding: 20, fontSize: 10, background: 'transparent', color: '#ccc', cursor: 'pointer'}} onClick={() => {
          this.hideSpecs()
        }}>
        CLOSE SPECS

        </div>
      </div>
    )
  }

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
      <Ground debug={this.props.debugMode} ascores={this.props.debugAstarScores} tanks={this.props.units} cursor={sel ? 'crosshair' : 'normal'}
      aim={this.aimOnCell.bind(this)} move={this.moveToCell.bind(this)}/>
    )
  }

  handleKeyInput() {
    document.body.onkeydown = (e) => {
        if(e.keyCode === 32){
            if(!this.state.shooting) {
              this.setState({ shooting: true })
              this.handleShotFired()
              this.shootingTimer = setInterval(() => { this.handleShotFired(); }, 300)
            }
        }
    }

    document.body.onkeyup = (e) => {
        if(e.keyCode === 32){
            this.setState({ shooting: false })
            clearInterval(this.shootingTimer)
        }
    }
  }

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

    //Temp debug-crap to display calculated targetArea
    /*let previewDivs = document.getElementsByClassName('tmp');
    for (let i = previewDivs.length-1; i >= 0; i--)
      document.body.removeChild(previewDivs[i]);
    let cannonPos = { x: ((tank.position.x-0.5)*100), y: ((tank.position.y-0.5)*100) };
    for (let i = 0; i < 4; i++) {
      let elm = document.createElement('div');
      //console.error(targetArea[i][0], targetArea[i][1]);
      elm.setAttribute('style', 'position: absolute; top: ' + ((targetArea[i][1]*50)+cannonPos.y) + 'px; left: ' + ((targetArea[i][0]*50)+cannonPos.x) + 'px; width: 5px; height: 5px; background-color: red;');
      elm.setAttribute('class', 'tmp');
      document.body.appendChild(elm);
    }*/

    //Find obstacles within target area, and blow em up!
    let grid = _grid.getGrid();
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
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
          } else if (grid[x][y].obstacle) {
            kill = true;
          }
          
          if (kill) {
            (new Audio(sound_explosion)).play();
            grid[x][y].isExploding = true;
            this.setState({refresh: this.state.refresh+1}); //TODO: Ugly-ass-hack, make the cell a state component instead?
            setTimeout(() => {
              grid[x][y].isExploding = false;
              grid[x][y].obstacle = false;
              if (unit) {
                //TODO: Remove unit from state
              }
              this.setState({refresh: this.state.refresh+1});
            }, 800);
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

  renderLogo() {
    return <div className='logo'><img src={logo} alt='logo'/></div>
  }

  renderNumDivs() {
    return <div className='totalDivs'>Total divs: {this.state.totalDivs}</div>
  }

	render() {
    return (
      <div>
        <div className='dashboard' style={{flexDirection: 'column'}}>
          <div><button style={{background: 'blue'}} onClick={this.addUnit.bind(this, TYPES.TANK_TYPE)}>ADD TANK UNIT</button></div>
          <div><button style={{background: 'green'}} onClick={this.addUnit.bind(this, TYPES.SOLDIER_TYPE)}>ADD SOLDIER UNIT</button></div>
          <div><button style={{background: 'red'}} onClick={this.toggleDebug.bind(this)}>TOGGLE A*</button></div>
          <div><button style={{background: 'darkred'}} onClick={this.toggleAscores.bind(this)}>TOGGLE A* SCORES</button></div>
          <div><button style={{background: 'purple'}} onClick={this.toggleAim.bind(this)}>TOGGLE AIM</button></div>
          {this.renderNumDivs()}
        </div>
        <div className='main' style={{...mainStyle}}>
          {/*  GRID */}
          {this.renderGround()}
          {/* TANK  */}
          {this.renderUnits()}
          {/* SPECS VIEW  */}
          {this.renderSpecsView()}
          {/* SPACEBAR */}
          {this.handleKeyInput()}
          {/* RETANX LOGO */}
          {this.renderLogo()}
        </div>
      </div>
    )
	}
}

const MSTP = (state) => {
	return {
    units: state.unitReducer.units,
    app: state.app,
    currentSelectionID: state.app.currentSelectionID,
    debugMode: state.app.debugMode,
    aimMode: state.app.aimMode,
    debugAstarScores: state.app.debugAstarScores
  }
}

const App = connect(MSTP, null)(MainConnect)

export default App
