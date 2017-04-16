import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as TYPES from '../units/types/unitTypes'
import BasePosition from '../units/base/BasePosition'
import Body from '../units/tank/components/Body'
import Cannon from '../units/tank/components/Cannon'
import Tracks from '../units/tank/components/Tracks'
import Outline from '../units/base/Outline'
import HP from '../units/base/HitPoints'
import SpecsView from '../units/tank/components/SpecsView'
import FootSoldier from '../units/soldiers/components/FootSoldier'

////////////////////////////////////////////////////////////////////////////////////////////
// Grid
import { Dimensions, Grid } from '../grid/Grid'
let _grid = null

////////////////////////////////////////////////////////////////////////////////////////////
// Generic Utils
import { Utils } from '../utils/Utils'
let utils = Utils.getInstance()

////////////////////////////////////////////////////////////////////////////////////////////
// Unit factory
import { UnitFactory } from '../units/utils/UnitFactory'
let unitFactory = UnitFactory.getInstance()

class UR extends Component {

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

  componentDidMount() {
    _grid = Grid.getInstance()
    this.addUnit(TYPES.TANK_TYPE, true)


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

  ////////////////////////////////////////////////////////////////////////////////////////////

  getRandomRotation() {
    return Math.floor(Math.random() * 50) + -50
  }

  coordinates(pos, width, height) {
    // console.log('pos', pos)
    let size = Dimensions().tileSize
    return {
      x: pos.x * size + (size / 2 - width / 2),
      y: pos.y * size + (size / 2 - height / 2)
    }
  }

  getIsThisUnitShooting(unit, id) {
    return (unit.selected) && (this.props.currentSelectionID === id) && (this.props.shooting) ? true : false
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  addUnit(type, firstUnit) {
    if(!type) {
      // default to use tank type
      type = TYPES.TANK_TYPE
    }
    // console.log('firstUnit', firstUnit)
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


  getSpeed(position) {
    // TODO TRAVEL SPEED
  }

  showSpecs() {
    this.props.dispatch({type: 'SHOW_DETAIL_VIEW'})
  }

  hideSpecs() {
    this.props.dispatch({type: 'HIDE_DETAIL_VIEW'})
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Select unit
  selectUnit(units, id) {
    this.props.dispatch({type: 'SELECT_UNIT', payload: {id: id }})
    _grid.resetCells()
    _grid.makeObstaclesOfUnitsWithHigherMass(units[id], units, id)

    // deselect all other units
    this.props.dispatch({type: 'DESELECT_ALL_BUT_ID', payload: {id: id }})
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

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
              this.selectUnit(units, tankUnit.id)
            }
           }}>
            <BasePosition moveSpeed={tankUnit.moveSpeed} position={this.coordinates(position, cellWidth, cellHeight)} >
              <Body specs={tankUnit} speed={this.getSpeed(position)} rotate={shouldRotate} rotation={angle}>
                <Tracks specs={tankUnit}/>
              </Body>
              <Cannon debugAim={this.props.aimMode}
              specs={tankUnit} rotate={shouldRotate}
              rotation={angle}
              shooting={this.getIsThisUnitShooting(tankUnit, index)}/>
              <HP specs={tankUnit} />
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
              this.selectUnit(units, soldierUnit.id)
            }
           }}>
              <BasePosition moveSpeed={soldierUnit.moveSpeed} position={this.coordinates(position, cellWidth, cellHeight)} >
                <FootSoldier
                isShooting={this.getIsThisUnitShooting(soldierUnit, index)}
                isMoving={this.props.isMoving} specs={soldierUnit}
                rotate={shouldRotate}
                rotation={angle}
                debugAim={this.props.aimMode}
                />
                <HP specs={soldierUnit} />
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

  render() {
    return <div>{this.renderUnits()}</div>

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

const UnitRenderer = connect(MSTP, null)(UR)

export default UnitRenderer
