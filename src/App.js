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
// import Dimensions from './Dimensions'

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
    this.state = {
      isAiming: false
    }
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

  addTank() {
    let tankPosition = this.getRandomPos()

    if(!tankPosition) {
      console.log('no available position for a unit')
      return
    }

    let randomize = false
    const tankUnit = {
      id: this.props.tanks.length,
      aimTarget: {x: 0, y: 0},
      position: tankPosition,
      width: randomize ? Math.floor(Math.random() * 45) + 40 : 40,
      height: randomize ? Math.floor(Math.random() * 50) + 45 : 50,
      cannonSize: randomize ? Math.floor(Math.random() * 100) + 70 : 65,
      background: '#131313',
      cabineColor: '#32237d',
      cannonColor: '#6262da',
      rotate: 'true',
      selected: false
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

    // Do A*
    let unit  = this.props.tanks[this.props.currentSelectionID]
    let start = _grid.getGrid()[unit.position.x][unit.position.y]

    // make sure that start cell isn´t a wall
    _grid.getGrid()[unit.position.x][unit.position.y].wall = false // FIX ?

    let end   = _grid.getGrid()[cell.y][cell.x]

    // eslint-disable-next-line
    let path = AStar(_grid, start, end)
    console.log('A* path', path)

    if(path.length === 0) {
      console.warn('No a * solution found')
      return
    }

    

    // path.reverse()
    // path.forEach((pathCell, index) => {
    //   let target = _grid.getGrid()[pathCell.y][pathCell.x]
    // })

    // Clear aim time each time a new aim action is called (takes 1 second to aim)
    clearTimeout(this.timer)
    // Move cannon action (aim)
    this.props.dispatch({type: 'AIM', payload: {id: this.props.tanks[this.props.currentSelectionID].id, target: cell } })
    this.setState({ isAiming: true })

    // Wait for aim animation to finish
    this.timer = setTimeout(() => {
      this.setState({ isAiming: false })
      this.props.dispatch({type: 'MOVE', payload: {id: this.props.tanks[this.props.currentSelectionID].id, target: cell} })
    }, 500)
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
