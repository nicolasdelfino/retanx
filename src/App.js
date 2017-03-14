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
    this.state = {
      isAiming: false
    }
  }

  getRandomPos3() {
    // let posX = Math.floor(Math.random() * 9)
    // lets posY = Math.floor(Math.random() * 5)

    // let randomPosIsTaken = this.props.tanks.forEach((tank) => {
    //   if(tank.position.x === posX && tank.position.y === posY) {
    //     return true
    //   }
    // })

    let amount = 10
    let w = DIMENSIONS().width / amount
    let h = DIMENSIONS().height / amount
    let cols = h / (amount)
    let rows = w / (amount)
    let grid = []
    for (let i = 0; i < rows; i++) {
      for (let x = 0; x < cols; x++) {

        if(this.props.tanks.length > 0) {
          for(var t = 0; t < this.props.tanks; t++) {
            let tank = this.props.tanks[t]
            if(tank.position.x !== i && tank.position.y !== x) {
              grid.push({x:i,y:x})
            }
          }
        }
        else {
          grid.push({x:i,y:x})
        }
      }
    }

    console.log(grid)

    return grid[Math.floor(Math.random() * grid.length-1)]
  }

  isPositionAvaliable(position) {
    let isAvailable = true
    this.props.tanks.forEach((tank, index) => {
      if(tank.position.x === position.x && tank.position.y === position.y) {
        isAvailable = false
      }
    })

    return isAvailable
  }

  getRandomPosition() {
    return {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 6)
    }
  }

  getRandomPos() {
    let foundPosition = false
    let position = null
    // let numTries = 0
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
      // numTries++;
    }
    // console.log('numTries', numTries, 'maxTries', maxTries)
    return foundPosition ? position : undefined
  }

  // background: '#383838',
  // cabineColor: '#383838',
  // cannonColor: '#696868',

  addTank() {
    let tankPosition = this.getRandomPos()

    if(!tankPosition) {
      console.log('no available position for a unit')
      return
    }

    const tankUnit = {
      id: this.props.tanks.length,
      aimTarget: {x: 0, y: 0},
      position: tankPosition,
      width: Math.floor(Math.random() * 45) + 40,
      height: Math.floor(Math.random() * 50) + 45,
      cannonSize: Math.floor(Math.random() * 100) + 70,
      background: '#131313',
      cabineColor: '#470606',
      cannonColor: '#463d3d',
      rotate: 'true',
      selected: false
    }

    this.props.dispatch({ type: 'ADD_TANK', payload: tankUnit})
  }

  toggleDebug() {
    this.props.dispatch({ type: 'TOGGLE_DEBUG' })
  }

  componentDidMount() {
    this.addTank()
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

          if(this.state.isAiming) {
            return
          }

          if(tankUnit.selected) {
            this.props.dispatch({type: 'DESELECT_UNIT', payload: {id: tankUnit.id }})
          }
          else {
            this.props.dispatch({type: 'SELECT_UNIT', payload: {id: tankUnit.id }})
            // deselct all other units
            this.props.dispatch({type: 'DESELECT_ALL_BUT_ID', payload: {id: tankUnit.id }})
          }
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

    // TODO - A* ?

    // Clear aim time each time a new aim action is called (takes 1 second to aim)
    clearTimeout(this.timer)
    // Move cannon action (aim)
    this.props.dispatch({type: 'AIM', payload: {id: this.props.tanks[this.props.currentSelectionID].id, target: cell } })
    this.setState({ isAiming: true })

    // Wait for aim animation to finish
    this.timer = setTimeout(() => {
      this.setState({ isAiming: false })
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
      <Grid debug={this.props.debugMode} tanks={this.props.tanks} cursor={sel ? 'crosshair' : 'normal'}
      aim={this.moveToCell.bind(this)}/>
    )
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
          {this.renderGrid()}
          {/* TANK  */}
          {this.renderTanks()}
          {/* SPECS VIEW  */}
          {this.renderSpecsView()}
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
