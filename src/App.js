import React from 'react';
import './App.css';
import { connect } from 'react-redux'
import Ground from './grid/Ground'
import TankPosition from './tank/TankPosition'
import Body from './tank/Body'
import Cannon from './tank/Cannon'
import Tracks from './tank/Tracks'
import Outline from './tank/Outline'
import SpecsView from './tank/SpecsView'

import sound_pew from './pew.mp3'
import sound_explosion from './explosion.mp3'
import logo from './retanx.png'

// import randomColor from 'randomcolor'

import { Dimensions, Grid } from './grid/Grid'
import { AStar } from './grid/AStar'
let _grid = null

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
      isFollowingPath: true,
      forceValUpdate: 0,
      shooting: false,
      refresh: 0
    }

  }


  isPositionAvaliable(position) {
    let isAvailable = true

    if(_grid.suggestedPositionIsAnObstacleCell(position)) {
      return false
    }

    // check units
    this.props.tanks.forEach((tank, index) => {
      if(tank.position.x === position.x && tank.position.y === position.y) {
        isAvailable = false
      }
    })


    return isAvailable
  }

  getRandomPosition() {
    let columns = _grid.getCols()
    let rows = _grid.getRows()
    // console.log('columns', columns, 'rows', rows)
    return {
      x: Math.floor(Math.random() * columns),
      y: Math.floor(Math.random() * rows)
    }
  }

  getRandomPos() {
    let foundPosition = false
    let position = null
    let maxTries = 9 * 5

    if(this.props.tanks.length === 0) {
      return this.getRandomPosition()
    }

    for(var i = 0; i < maxTries; i++) {
      position = this.getRandomPosition()
      // eslint-disable-next-line
      foundPosition = this.isPositionAvaliable(position)

      if(foundPosition) {
        break;
      }
    }
    return foundPosition ? position : undefined
  }

  shadeColor(color, percent) {

      var R = parseInt(color.substring(1,3),16)
      var G = parseInt(color.substring(3,5),16)
      var B = parseInt(color.substring(5,7),16)

      R = parseInt(R * (100 + percent) / 100, 10)
      G = parseInt(G * (100 + percent) / 100, 10)
      B = parseInt(B * (100 + percent) / 100, 10)

      R = (R<255)?R:255;
      G = (G<255)?G:255;
      B = (B<255)?B:255;

      var RR = ((R.toString(16).length===1)?"0"+R.toString(16):R.toString(16));
      var GG = ((G.toString(16).length===1)?"0"+G.toString(16):G.toString(16));
      var BB = ((B.toString(16).length===1)?"0"+B.toString(16):B.toString(16));

      return "#"+RR+GG+BB;
  }

  addTank() {
    let tankPosition = this.getRandomPos()

    if(!tankPosition) {
      console.log('no available position for a unit')
      return
    }

    // Colors
    let baseBlue = '#131313'
    let baseRed = '#131313'
    let cabinBlue = '#32237d'
    let cabinRed = '#7d2333'
    let cannonBlue = '#6262da'
    let cannonRed = '#d61818'

    let baseColor = this.props.tanks.length % 2 ? baseBlue : baseRed
    let cabinColor = this.props.tanks.length % 2 ? cabinBlue : cabinRed
    let cannonColor = this.props.tanks.length % 2 ? cannonBlue : cannonRed

    let randomize = false
    const tankUnit = {
      id:           this.props.tanks.length,
      aimTarget:    {x: 0, y: 0},
      position:     tankPosition,
      width:        randomize ? Math.floor(Math.random() * 45) + 40 : 35,
      height:       randomize ? Math.floor(Math.random() * 50) + 45 : 50,
      cannonSize:   randomize ? Math.floor(Math.random() * 100) + 70 : 70,
      background:   baseColor,
      cabineColor:  cabinColor,
      cannonColor:  cannonColor,
      rotate:       'true',
      selected:     false,
      angle:        0
    }

    this.props.dispatch({ type: 'ADD_TANK', payload: tankUnit})
  }

  toggleDebug() {
    this.props.dispatch({ type: 'TOGGLE_DEBUG' })
  }

  componentDidMount() {
    _grid = Grid.getInstance()
    this.addTank()
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

  getIsTankShooting(unit, id) {
    return (unit.selected) && (this.props.currentSelectionID === id) && (this.state.shooting) ? true : false
  }

  renderTanks() {
    let tanks = this.props.tanks
    let units = []

    tanks.forEach((tankUnit, index) => {
      let shouldRotate  = tankUnit.rotate
      let position      = tankUnit.position
      let width         = tankUnit.width
      let height        = tankUnit.height
      let angle         = tankUnit.angle;

      units.push(
        <div id={'tank_' + index} key={index}>
        <div style={{'cursor': 'pointer'}} onClick={() => {
          if(this.state.isAiming) {
            return
          }

          if(tankUnit.selected) {
            this.props.dispatch({type: 'DESELECT_UNIT', payload: {id: tankUnit.id }})
          }
          else {
            this.props.dispatch({type: 'SELECT_UNIT', payload: {id: tankUnit.id }})
            // deselect all other units
            this.props.dispatch({type: 'DESELECT_ALL_BUT_ID', payload: {id: tankUnit.id }})
          }
         }}>
          <TankPosition position={this.coordinates(position, width, height)} >
            <Body specs={tankUnit} speed={this.getSpeed(position)} rotate={shouldRotate} rotation={angle}>
              <Tracks specs={tankUnit}/>
            </Body>
            <Cannon debug={this.props.debugMode} specs={tankUnit} rotate={shouldRotate} rotation={angle} shooting={this.getIsTankShooting(tankUnit, index)}/>
          </TankPosition>
          <Outline specs={tankUnit} rotate={shouldRotate} position={this.coordinates(position, width, height)} rotation={angle}/>
          </div>
          <SpecsView specs={tankUnit}
          details={this.showSpecs.bind(this)}
          rotate={shouldRotate}
          position={this.coordinates(position, width, height)}
          rotation={angle}/>
        </div>
      )
    })
    return units
  }

  followPath(start, path) {
    path.reverse()

    let end = path[path.length -1]
    let animationCells = []

    clearTimeout(this.timer)

    for(var i = 0; i < path.length; i ++) {
      if(i > 0 && i < path.length -1) {
        let current = path[i]
        let previous = path[i -1]
        let next = path[i +1]
        if(previous.x !== next.x && previous.y !== next.y) {
          animationCells.push(current)
        }
      }
    }

    animationCells.push(end)
    // console.log('animationCells', animationCells, animationCells.length)

    animationCells.forEach((item, index) => {
      item.tempPathString = index
      let delay = index * 1500
      this.timer = setTimeout(() => {
        // console.log('pos', _grid.getPositionForCell(item))
        let position = {
          x: item.y,
          y: item.x
        }


        // aim cannon
        this.props.dispatch({type: 'AIM', payload: {id: this.props.tanks[this.props.currentSelectionID].id, target: position, angle: this.aimDegrees(this.props.tanks[this.props.currentSelectionID], { x: position.y, y: position.x }) } })

        // move unit
        setTimeout(() => {
          this.props.dispatch({type: 'MOVE', payload: {id: this.props.tanks[this.props.currentSelectionID].id, target: position}})
        }, 500)

      }, delay)
    })


    this.setState({ forceValUpdate: this.state.forceValUpdate + 1 })
  }


  moveToCell(cell) {
    if(!this.props.tanks[this.props.currentSelectionID].selected) {
      return null
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // A* - Wikipedia source: https://en.wikipedia.org/wiki/A*_search_algorithm
    //////////////////////////////////////////////////////////////////////////////////////////

    let unit  = this.props.tanks[this.props.currentSelectionID]
    let start = _grid.getGrid()[unit.position.x][unit.position.y]
    let end   = _grid.getGrid()[cell.y][cell.x]

    // make sure that start cell isn´t a wall
    start.obstacle = false
    start.showObstacle = false

    let path = AStar(_grid, start, end, this.props.tanks, this.props.currentSelectionID)
    console.log('A* path', path)

    if(path.length === 0) {
      console.warn('No a * solution found')

      // aim cannon
      this.props.dispatch({type: 'AIM', payload: {id: this.props.tanks[this.props.currentSelectionID].id, target: cell } })

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
      this.props.dispatch({type: 'AIM', payload: {id: this.props.tanks[this.props.currentSelectionID].id, target: cell } })
      this.setState({ isAiming: true })

      // Wait for aim animation to finish
      this.timer = setTimeout(() => {
        this.setState({ isAiming: false })
        this.props.dispatch({type: 'MOVE', payload: {id: this.props.tanks[this.props.currentSelectionID].id, target: cell}})
      }, 500)
    }
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

    // let tank = this.props.tanks[this.props.currentSelectionID]
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
    if(this.props.tanks.length === 0) {
      return null
    }

    let sel = false
    this.props.tanks.forEach((tank) => {
      if(tank.selected) {
        sel = true
      }
    })
    return (
      <Ground debug={this.props.debugMode} tanks={this.props.tanks} cursor={sel ? 'crosshair' : 'normal'}
      aim={this.moveToCell.bind(this)}/>
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
    let tank = this.props.tanks[this.props.currentSelectionID];
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
    let grid = _grid.getGrid();
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        if (grid[x][y].obstacle) {
          if (this.pointInPolygon(x+0.5, y+0.5, targetArea)) {
            (new Audio(sound_explosion)).play();
            grid[x][y].isExploding = true;
            this.setState({refresh: this.state.refresh+1}); //TODO: Ugly-ass-hack, make the cell a state component instead?
            setTimeout(() => {
              grid[x][y].isExploding = false;
              grid[x][y].obstacle = false;
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

	render() {
    return (
      <div>
        <div style={{flexDirection: 'column'}}>
          <button onClick={this.addTank.bind(this)}>ADD TANK</button>
          <button onClick={this.toggleDebug.bind(this)}>TOGGLE DEBUG</button>
        </div>
        <div className='main' style={{...mainStyle}}>
          {/*  GRID */}
          {this.renderGround()}
          {/* TANK  */}
          {this.renderTanks()}
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
    tanks: state.tanks.units,
    app: state.app,
    currentSelectionID: state.app.currentSelectionID,
    debugMode: state.app.debugMode
  }
}

const App = connect(MSTP, null)(MainConnect)

export default App
