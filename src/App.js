import React from 'react';
import './css/App.css';
import { connect } from 'react-redux'
import Ground from './grid/Ground'


import logo from './retanx.png'

import UnitRenderer from './systems/UnitRenderer'
import UnitController from './systems/UnitController'
import InputController from './systems/InputController'

import * as TYPES from './units/types/unitTypes'

////////////////////////////////////////////////////////////////////////////////////////////
// Grid and aStar
import { Dimensions, Grid } from './grid/Grid'
let _grid = null

////////////////////////////////////////////////////////////////////////////////////////////
// Unit factory
import { UnitFactory } from './units/utils/UnitFactory'
let unitFactory = UnitFactory.getInstance()


////////////////////////////////////////////////////////////////////////////////////////////
// Generic Utils
import { Utils } from './utils/Utils'
let utils = Utils.getInstance()

class MainConnect extends React.Component {

  constructor(props) {
    super(props)
    this.animationTimer = null
    this.moveTimer = null
    this.shootingTimer = null
    this.state = {
      isAiming: false,
      isMoving: false,
      isAnimating: false,
      isFollowingPath: true,
      forceValUpdate: 0,
      shooting: false,
      refresh: 0,
      totalDivs: 0
    }
  }

  componentDidMount() {
    _grid = Grid.getInstance()
    // this.addUnit(TYPES.TANK_TYPE, true)


    setInterval(() => {
      this.setState({
        totalDivs: utils.getTotalDivs()
      })

    }, 1000)

    // rotate camera
    setInterval(() => {
      this.props.dispatch({ type: 'SET_RANDOM_ROTATION', payload: this.getRandomRotation()})

    }, 10000)
  }

  getRandomRotation() {
    return Math.floor(Math.random() * 50) + -50
  }

  addUnit(type, firstUnit) {
    if(!type) {
      // default to use tank type
      type = TYPES.TANK_TYPE
    }
    console.log('firstUnit', firstUnit)
    // pick random position
    let unitPosition = firstUnit === true ? { x: Math.floor(_grid.getCols() / 2), y: 3 } : unitFactory.getRandomPos(this.props.units)

    // console.warn(unitPosition)

    if(!unitPosition) {
      console.log('No available position for unit')
      return
    }

    let unit = unitFactory.getUnit(type, unitPosition, this.props.units)
    this.props.dispatch({ type: 'ADD_UNIT', payload: unit})

    _grid.getGrid()[unitPosition.x][unitPosition.y].obstacle = false
    _grid.getGrid()[unitPosition.x][unitPosition.y].addNeighbors(_grid.getGrid(), 'normal')
    _grid.getGrid()[unitPosition.x][unitPosition.y].reveal(true)
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

  toggleObstacles() {
    this.props.dispatch({ type: 'TOGGLE_OBSTACLES' })
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
      <Ground debugObstacles={this.props.debugObstacles} debug={this.props.debugMode} ascores={this.props.debugAstarScores} units={this.props.units} cursor={sel ? 'crosshair' : 'normal'}
      aim={this.aimOnCell.bind(this)} move={this.moveToCell.bind(this)}/>
    )
  }

  renderLogo() {
    return <div className='logo'><img src={logo} alt='logo'/></div>
  }

  renderNumDivs() {
    return <div className='totalDivs'>Total divs: {this.state.totalDivs}</div>
  }

  getMainCSS() {
    return this.state.shooting === true ?  'mainFire' : 'noFire'
  }

  getZoomIn() {
    let zoom = this.props.zoom + 0.1
    if(zoom > 1) {
      zoom = 1
    }
    return zoom
  }

  getZoomOut() {
    let zoom = this.props.zoom - 0.1
    if(zoom <= 0) {
      zoom = 0
    }
    return zoom
  }

  easeInOut(currentTime, start, change, duration) {
      currentTime /= duration / 2;
      if (currentTime < 1) {
          return change / 2 * currentTime * currentTime + start;
      }
      currentTime -= 1;
      return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
  }


  scrollTo(element, to, duration) {
      let start = element.scrollTop,
          change = to - start,
          increment = 20;

      const animateScroll = (elapsedTime) => {
          elapsedTime += increment;
          var position = this.easeInOut(elapsedTime, start, change, duration);
          element.scrollTop = position;
          if (elapsedTime < duration) {
              setTimeout(function() {
                  animateScroll(elapsedTime);
              }, increment);
          }
      };

      animateScroll(0);
  }

  focusCamera(elementId) {
    let id = elementId || 'unit_0'

    let element     = document.querySelectorAll('#' + id + ' .position')
    let rect        = element[0].getBoundingClientRect();
    let offsetTop   = rect.top + document.body.scrollTop

    let windowUnitCenter = Math.floor(offsetTop) - Math.floor(window.innerHeight / 2)

    utils.scrollTo(document.body, windowUnitCenter, 1000);
  }

	render() {
    return (
      <div className='wrapper'>
        <div className={this.state.shooting ? 'dashboard mainFire' : 'dashboard'} style={{flexDirection: 'column'}}>
          {/* RETANX LOGO */}
          {this.renderLogo()}
          <div><button onClick={this.addUnit.bind(this, TYPES.TANK_TYPE)}>ADD TANK UNIT</button></div>

          <div><button onClick={this.addUnit.bind(this, TYPES.SOLDIER_TYPE)}>ADD SOLDIER UNIT</button></div>

          <div><button style={{background: this.props.debugMode ? 'red' : 'black', color: this.props.debugMode ? 'black' : 'red'}} onClick={this.toggleDebug.bind(this)}>TOGGLE A*</button></div>

          <div><button style={{background: this.props.debugAstarScores ? 'red' : 'black', color: this.props.debugAstarScores ? 'black' : 'red'}} onClick={this.toggleAscores.bind(this)}>TOGGLE A* SCORES</button></div>

          <div><button style={{background: this.props.aimMode ? 'red' : 'black', color: this.props.aimMode ? 'black' : 'red'}} onClick={this.toggleAim.bind(this)}>TOGGLE AIM</button></div>

          <div><button style={{background: this.props.debugObstacles ? 'red' : 'black', color: this.props.debugObstacles ? 'black' : 'red'}} onClick={this.toggleObstacles.bind(this)}>TOGGLE OBSTACLES</button></div>

          <div><button style={{background: 'black', color: 'red'}} onClick={()=> {
            this.props.dispatch({ type: 'SET_ZOOM', payload: this.getZoomIn()})
          }}>ZOOM IN</button></div>

          <div><button style={{background: 'black', color: 'red'}} onClick={()=> {
            this.props.dispatch({ type: 'SET_ZOOM', payload: this.getZoomOut()})
          }}>ZOOM OUT</button></div>

          <div><button style={{background: 'black', color: 'red'}} onClick={()=> {
            this.focusCamera()
          }}>FOCUS</button></div>

          {this.renderNumDivs()}

          <div className='instructions'>PRESS A TO FIRE</div>
        </div>
        <div className='zoomWrapper' style={{'transform': 'scale(' + this.props.zoom + ')'}}>
        <div className='rotationWrapper' style={{'transform': 'rotate(' + this.props.cameraRotation + 'deg)'}}>
        <div id='board'>
            <div className={this.getMainCSS()}>
            {/*  GRID */}
            <UnitController />
            {/* TANK  */}
            <UnitRenderer />
            {/* SPECS VIEW  */}
            {this.renderSpecsView()}
            {/* SPACEBAR */}
            <InputController />
            </div>
        </div>
        </div>
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
    debugAstarScores: state.app.debugAstarScores,
    debugObstacles: state.app.debugObstacles,
    zoom: state.app.zoom,
    cameraRotation: state.app.cameraRotation
  }
}

const App = connect(MSTP, null)(MainConnect)

export default App
