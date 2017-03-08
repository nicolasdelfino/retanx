import React from 'react';
import './App.css';
import { connect } from 'react-redux'
import Grid from './Grid'
import Tank from './tank/Tank'
import Cannon from './tank/Cannon'
import Tracks from './tank/Tracks'
import DIMENSIONS from './Dimensions'

const mainStyle = {
  width: DIMENSIONS().width, height: DIMENSIONS().height,
  color: '#fff',
  background: '#e8e8e8',
  position: 'relative'
}

class MainConnect extends React.Component {

  componentDidMount() {
    this.props.dispatch({type: 'AIM', payload: {x:0,y:0}})
    this.props.dispatch({type: 'MOVE', payload: {x:3,y:3}})
  }

  coordinates(pos, width, height) {
    let size = DIMENSIONS().width / 10
    return {
      x: pos.x * size + (size / 2 - width / 2),
      y: pos.y * size + (size / 2 - height / 2)
    }
  }

  aimDegrees(tank) {
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

  }

  renderTank() {
    let tank = this.props.tank
    // console.log('tank', tank)
    return (
      <div>
      <TankWrapper position={this.coordinates(tank.position, tank.width, tank.height)}>
        <Tank specs={tank} speed={this.getSpeed(tank.position)} rotate={this.props.tank.rotate} rotation={this.aimDegrees(tank)}>
          <Tracks specs={tank}/>
        </Tank>
        <Cannon specs={tank} rotate={this.props.tank.rotate} rotation={this.aimDegrees(tank)}/>
      </TankWrapper>
      </div>
    )
  }

  callCell(cell) {
    
    this.props.dispatch({type: 'AIM', payload: cell})

    setTimeout(() => {
      this.props.dispatch({type: 'MOVE', payload: cell})
    }, 1000)
  }

	render() {
    return (
      <div>
        <div className='main' style={{...mainStyle}}>

          <Grid aim={this.callCell.bind(this)}/>

          {this.renderTank()}

        </div>
      </div>
    )
	}
}

class TankWrapper extends React.Component {
  render() {

    return (
      <div style={{position: 'absolute', left: this.props.position.x, top: this.props.position.y, 'transition': 'all 1s ease'}}>{this.props.children}</div>
    )
  }
}


const MSTP = (state) => {
	return {
    tank: state.tank
  }
}

const App = connect(MSTP, null)(MainConnect)

export default App
