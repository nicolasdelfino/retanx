import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as TYPES from '../types/unitTypes'
import BasePosition from '../base/BasePosition'
import Body from '../tank/components/Body'
import Cannon from '../tank/components/Cannon'
import Tracks from '../tank/components/Tracks'
import Outline from '../base/Outline'
import HP from '../base/HitPoints'
import SpecsView from '../tank/components/SpecsView'
import FootSoldier from '../soldiers/components/FootSoldier'
import NinjaUnit from '../ninja/components/NinjaUnit'
// Grid
import { Dimensions, Grid } from '../../grid/Grid'
let _grid = null

// Unit factory
import { UnitFactory } from './UnitFactory'
let unitFactory = UnitFactory.getInstance()

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
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
  //_____________________________________________________________________________________________________
  componentDidMount() {
    _grid = Grid.getInstance()
    this.addUnit(TYPES.NINJA_TYPE, true)
  }
  //_____________________________________________________________________________________________________
  getRandomRotation() {
    return Math.floor(Math.random() * 50) + -50
  }
  //_____________________________________________________________________________________________________
  coordinates(pos, width, height) {
    // console.log('pos', pos)
    let size = Dimensions().tileSize
    return {
      x: pos.x * size + (size / 2 - width / 2),
      y: pos.y * size + (size / 2 - height / 2)
    }
  }
  //_____________________________________________________________________________________________________
  getIsThisUnitShooting(unit, id) {
    return (unit.selected) && (this.props.currentSelectionID === id) && (this.props.shooting) ? true : false
  }
  //_____________________________________________________________________________________________________
  addUnit(type, firstUnit) {
    if(!type) {
      // default to use tank type
      type = TYPES.TANK_TYPE
    }
    let unitPosition = firstUnit === true ? { x: Math.floor(_grid.getCols() / 2), y: 3 } : unitFactory.getRandomPos(this.props.units)

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
  //_____________________________________________________________________________________________________
  getSpeed(position) {
    // TODO TRAVEL SPEED
  }
  //_____________________________________________________________________________________________________
  showSpecs() {
    this.props.dispatch({type: 'SHOW_DETAIL_VIEW'})
  }
  //_____________________________________________________________________________________________________
  hideSpecs() {
    this.props.dispatch({type: 'HIDE_DETAIL_VIEW'})
  }

  //_____________________________________________________________________________________________________
  // Select unit
  selectUnit(units, id) {
    this.props.dispatch({type: 'SELECT_UNIT', payload: {id: id }})
    _grid.resetCells()
    _grid.makeObstaclesOfUnitsWithHigherMass(units[id], units, id)

    // deselect all other units
    this.props.dispatch({type: 'DESELECT_ALL_BUT_ID', payload: {id: id }})
  }
  //_____________________________________________________________________________________________________
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
      else if(type === TYPES.NINJA_TYPE) {
        let ninjaUnit = unit
        unitList.push(
          <div id={'unit_' + id} key={index}>
          <div style={{'cursor': 'pointer'}} onClick={() => {
            if(this.state.isAiming) { return }
            if(ninjaUnit.selected) {
              this.props.dispatch({type: 'DESELECT_UNIT', payload: {id: ninjaUnit.id }})
            }
            else {
              this.selectUnit(units, ninjaUnit.id)
            }
           }}>
              <BasePosition moveSpeed={ninjaUnit.moveSpeed} position={this.coordinates(position, cellWidth, cellHeight)} >
                <NinjaUnit
                isMoving={this.props.isMoving} specs={ninjaUnit}
                rotate={shouldRotate}
                rotation={angle}
                animation={this.props.ninjaAnimation}
                />
                <HP specs={ninjaUnit} />
              </BasePosition>
              <Outline moveSpeed={ninjaUnit.moveSpeed} specs={ninjaUnit} rotate={shouldRotate} position={this.coordinates(position, cellWidth, cellHeight)} rotation={angle}/>
            </div>
            <SpecsView specs={ninjaUnit}
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
