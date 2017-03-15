import React from 'react';

import DIMENSIONS from './Dimensions'

import { Grid } from './Grid'

let _grid = null

class Ground extends React.Component {
  constructor(props) {
    super(props);
    this.clickCell = this.clickCell.bind(this)
  }

  componentWillMount() {
    _grid = Grid.getInstance()
  }

  clickCell(i,x) {
    this.props.aim({x: i, y: x})
  }

  renderGround() {
    let map = _grid.getGrid()
    let amount = _grid.getDivider()
    let w = DIMENSIONS().width / amount
    let h = DIMENSIONS().height / amount
    let rows = _grid.getRows()
    let cols = _grid.getCols()
    let grid = []
    let borderColor = '#efefef'

    console.log('rows', rows, 'cols', cols)

    const cellStyle = {
      display: 'flex', fontSize:10, color: '#ccc',width: w, height: w, background: 'black', border: '0px solid ' + borderColor
    }

    // console.log('rows', rows, 'cols', cols) x: {i} y: {x}
    for (let i = 0; i < cols; i++) {
      let row = []
      for (let x = 0; x < rows; x++) {

        var test = map[i][x]
        console.log('i', i)
        console.log('x', x)
        console.log(test)

        row.push(<div key={x} style={{ ...cellStyle }} onClick={() => this.clickCell(x,i)}>
        <div className='gridItem' style={{opacity: 0.4, flex:1, border: '0px dashed #7d725f'}}></div>
        </div>)
      }
      grid.push(<div key={i} style={{flexDirection: 'row'}}>{row}</div>)
    }

    return grid
  }

  isCellInUse(x,y) {
    let inUse = false
    this.props.tanks.forEach((tank) => {
      if(tank.position.x === x && tank.position.y === y) {
        inUse = true
      }
    })

    return inUse
  }

  renderDebug() {
    let amount = _grid.getDivider()
    let w = DIMENSIONS().width / amount
    let h = DIMENSIONS().height / amount
    let rows = _grid.getRows()
    let cols = _grid.getCols()
    let grid = []
    let borderColor = '#efefef'

    console.log('w', w)

    const cellStyle = {
      display: 'flex', fontSize:10, color: '#05e400',width: w, height: w, background: 'transparent', border: '0px solid ' + borderColor
    }

    // console.log('rows', rows, 'cols', cols) x: {i} y: {x}
    for (let i = 0; i < cols; i++) {
      let row = []
      for (let x = 0; x < rows; x++) {

        if(this.isCellInUse(i,x) ) {
          row.push(<div key={x} style={{ ...cellStyle, background: 'transparent', color: '#05e400' }} onClick={() => this.clickCell(x,i)}>
          <div className='debugItemCell' style={{flex:1, color: '#05e400', border: '1px solid #05e400'}}>{x},{i}</div>
          </div>)
        }
        else {
          row.push(<div key={x} style={{ ...cellStyle }} onClick={() => this.clickCell(x,i)}>
          <div style={{opacity: 1, flex:1, border: '0px dashed #7d725f'}}>{x},{i}</div>
          </div>)
        }
      }
      grid.push(<div key={i} style={{flexDirection: 'row'}}>{row}</div>)
    }
    return grid
  }

  render() {
    return (
      <div>
        <div className={this.props.cursor} style={{display: 'flex', width: DIMENSIONS().width, height: DIMENSIONS().height, flexDirection: 'row'}}>
          {this.renderGround()}
        </div>
        <div style={{
          display: 'flex', position: 'absolute', top: 0, left: 0, opacity: 0.4,
          width: DIMENSIONS().width, height: DIMENSIONS().height, flexDirection: 'row',
          pointerEvents: 'none'
        }}>
          {this.props.debug ? this.renderDebug() : null}
        </div>
      </div>
    )
  }
}

export default Ground
