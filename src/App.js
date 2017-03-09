import React from 'react';
import './App.css';
import { connect } from 'react-redux'
import Grid from './Grid'
import Tank from './tank/Tank'
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
    // TODO TRAVEL SPEED
  }

  renderTank() {
    let tank = this.props.tank
    let shouldRotate = this.props.tank.rotate
    let position = tank.position
    let width = tank.width
    let height = tank.height
    return (
      <div>
      <div style={{'cursor': 'pointer'}} onClick={() => {
        this.props.dispatch({type: 'SELECT'})
       }}>
        <Tank position={this.coordinates(position, width, height)} >
          <Body specs={tank} speed={this.getSpeed(position)} rotate={shouldRotate} rotation={this.aimDegrees(tank)}>
            <Tracks specs={tank}/>
          </Body>
          <Cannon specs={tank} rotate={shouldRotate} rotation={this.aimDegrees(tank)}/>
        </Tank>
        <Outline specs={tank} rotate={shouldRotate} position={this.coordinates(position, width, height)} rotation={this.aimDegrees(tank)}/>
        </div>
        <SpecsView specs={tank}
        details={this.showSpecs.bind(this)}
        rotate={shouldRotate}
        position={this.coordinates(position, width, height)}
        rotation={this.aimDegrees(tank)}/>
      </div>
    )
  }

  callCell(cell) {
    if(!this.props.tank.selected) {
      return null
    }

    this.props.dispatch({type: 'AIM', payload: cell})
    setTimeout(() => {
      this.props.dispatch({type: 'MOVE', payload: cell})
    }, 1500)
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

	render() {
    return (
      <div>
        <div className='main' style={{...mainStyle}}>
          {/*  GRID */}
          <Grid cursor={this.props.tank.selected ? 'crosshair' : 'normal'} aim={this.callCell.bind(this)}/>
          {/* TANK  */}
          {this.renderTank()}
          {/* SPECS VIEW  */}
          {this.renderSpecsView()}

        </div>
      </div>
    )
	}
}

const MSTP = (state) => {
	return {
    tank: state.tank,
    app: state.app
  }
}

const App = connect(MSTP, null)(MainConnect)

export default App
