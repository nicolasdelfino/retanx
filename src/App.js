import React from 'react';
import './App.css';
import { connect } from 'react-redux'
import * as actions from './store/actions/actions'

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
  translateCoordinatesToPixels(pos, width, height) {
    let size = DIMENSIONS().width / 10
    return {
      x: pos.x * size + (size / 2 - width / 2),
      y: pos.y * size + (size / 2 - height / 2)
    }
  }

  renderTanks() {
    return this.props.app.tanks.map((tank, index) => {
      return (<Tank key={index} specs={tank} position={this.translateCoordinatesToPixels(tank.position, tank.width, tank.height)} rotation={tank.rotation.body}>
        <Cannon specs={tank} rotation={tank.rotation.cannon}/>
        <Tracks specs={tank}/>
      </Tank>)
    })
  }
	render() {
		return (
      <div>
			<div className='main' style={{...mainStyle}}>

        <Grid />

				{this.renderTanks()}

			</div>

      <div className="test"></div>
			<button onClick={() => {this.props.dispatch(actions.initApp())}}>INIT</button>
      </div>
		);
	}
}



const MSTP = (state) => {
	return {app: state.appReducer}
}

const App = connect(MSTP, null)(MainConnect)

export default App
