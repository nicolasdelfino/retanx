import React from 'react';
import './App.css';
import { connect } from 'react-redux'
import Grid from './Grid'
import TankPosition from './tank/TankPosition'
import Body from './tank/Body'
import Cannon from './tank/Cannon'
import Tracks from './tank/Tracks'
import Outline from './tank/Outline'
import SpecsView from './tank/SpecsView'
import DIMENSIONS from './Dimensions'

const mainStyle = {
  width: DIMENSIONS().width, height: DIMENSIONS().height,
  color: '#fff',
  background: '#e8e8e8',
  position: 'relative',
  border: '0px solid #402c1b'
}

class MainConnect extends React.Component {

  constructor(props) {
    super(props)
    this.timer = null
  }

  getRandomPos() {
    let foundFreeSlot = false
    let posX, posY
    do {
      posX = Math.floor(Math.random() * 9) // TODO get values from grid
      posY = Math.floor(Math.random() * 5)

      if(this.props.tanks.length === 0) {
        foundFreeSlot = true
        return {x: posX, y: posY}
      }

      foundFreeSlot = true
      this.props.tanks.forEach((tank) => {
        if(tank.position.x === posX && tank.position.y === posY) {
          foundFreeSlot = false
        }
      })

      for (var i = 0; i < this.props.tanks.length; i++) {
        if(i === this.props.tanks.length -1) {
          console.log('end')
        }

      }

    } while (!foundFreeSlot);

    if(foundFreeSlot) {
      return {x: posX, y: posY}
    }
  }

  addTank() {
    let tankPosition = this.getRandomPos()
    const tankUnit = {
      id: this.props.tanks.length,
      aimTarget: {x: 0, y: 0},
      position: tankPosition,
      width: Math.floor(Math.random() * 45) + 35,
      height: Math.floor(Math.random() * 60) + 55,
      cannonSize: Math.floor(Math.random() * 130) + 70,
      background: '#383838',
      cabineColor: '#383838',
      cannonColor: '#696868',
      rotate: 'true',
      selected: false
    }

    this.props.dispatch({ type: 'ADD_TANK', payload: tankUnit})
  }

  componentDidMount() {
    this.addTank()
    //this.props.dispatch( {type: 'AIM', payload: { id: 0, target: {x:0, y:0 } } } )
    //this.props.dispatch( {type: 'MOVE', payload: { id: 0, target: {x:3, y:3 } } } )
  }

  coordinates(pos, width, height) {
    // console.log('pos', pos)
    let size = DIMENSIONS().width / 10
    return {
      x: pos.x * size + (size / 2 - width / 2),
      y: pos.y * size + (size / 2 - height / 2)
    }
  }

  aimDegrees(tank) {
    // console.warn('tank', tank)
    let position = tank.position
    let p1 = {
      x: tank.aimTarget.x,
      y: tank.aimTarget.y
    }
    let p2 = {
      x: position.x,
      y: position.y
    }

    let deltaX = p2.x - p1.x
    let deltaY = p2.y - p1.y
    var angle = Math.atan2(deltaX, deltaY) * (180.0 / Math.PI);

    let a =  Math.abs(180 - ( angle ))
    return a
  }

  getSpeed(position) {
    // TODO TRAVEL SPEED
  }

  renderTanks() {
    let tanks = this.props.tanks
    let units = []

    tanks.forEach((tankUnit, index) => {
      let shouldRotate  = tankUnit.rotate
      let position      = tankUnit.position
      let width         = tankUnit.width
      let height        = tankUnit.height

      units.push(
        <div id={'tank_' + index} key={index}>
        <div style={{'cursor': 'pointer'}} onClick={() => {
          console.log('tankUnit', tankUnit)
          this.props.dispatch({type: 'SELECT', payload: {id: tankUnit.id }})
         }}>
          <TankPosition position={this.coordinates(position, width, height)} >
            <Body specs={tankUnit} speed={this.getSpeed(position)} rotate={shouldRotate} rotation={this.aimDegrees(tankUnit)}>
              <Tracks specs={tankUnit}/>
            </Body>
            <Cannon specs={tankUnit} rotate={shouldRotate} rotation={this.aimDegrees(tankUnit)}/>
          </TankPosition>
          <Outline specs={tankUnit} rotate={shouldRotate} position={this.coordinates(position, width, height)} rotation={this.aimDegrees(tankUnit)}/>
          </div>
          <SpecsView specs={tankUnit}
          details={this.showSpecs.bind(this)}
          rotate={shouldRotate}
          position={this.coordinates(position, width, height)}
          rotation={this.aimDegrees(tankUnit)}/>
        </div>
      )
    })
    return units
  }

  moveToCell(cell) {
    if(!this.props.tanks[this.props.currentSelectionID].selected) {
      return null
    }
    // Clear aim time each time a new aim action is called (takes 1 second to aim)
    clearTimeout(this.timer)
    // Move cannon action (aim)
    this.props.dispatch({type: 'AIM', payload: {id: this.props.tanks[this.props.currentSelectionID].id, target: cell } })
    // Wait for aim animation to finish
    this.timer = setTimeout(() => {
      this.props.dispatch({type: 'MOVE', payload: {id: this.props.tanks[this.props.currentSelectionID].id, target: cell} })
    }, 1000)
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
      width: DIMENSIONS().width, height: DIMENSIONS().height,
      background: 'rgba(252, 27, 27, 0.5)',
      justifyContent: 'center', alignItems: 'center'
    }
    if(!this.props.app.detailsView) {
      return null
    }
    return (
      <div style={{...specsStyle}}>
        <div style={{padding: 20, background: 'transparent', color: '#ccc', cursor: 'pointer'}} onClick={() => {
          this.hideSpecs()
        }}>CLOSE SPECS</div>
      </div>
    )
  }

  renderGrid() {
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
      <Grid cursor={sel ? 'crosshair' : 'normal'}
      aim={this.moveToCell.bind(this)}/>
    )
  }

	render() {
    return (
      <div>
        <div className='main' style={{...mainStyle}}>
          {/*  GRID */}
          {this.renderGrid()}
          {/* TANK  */}
          {this.renderTanks()}
          {/* SPECS VIEW  */}
          {this.renderSpecsView()}

          <div><button onClick={this.addTank.bind(this)}>ADD TANK</button></div>

        </div>
      </div>
    )
	}
}

const MSTP = (state) => {
	return {
    tanks: state.tanks.units,
    app: state.app,
    currentSelectionID: state.app.currentSelectionID
  }
}

const App = connect(MSTP, null)(MainConnect)

export default App
