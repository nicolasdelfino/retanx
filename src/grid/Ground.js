import React from 'react';

import { Dimensions, Grid } from './Grid'

let _grid = null

class Ground extends React.Component {
  constructor(props) {
    super(props);
    this.clickCell = this.clickCell.bind(this)
  }

  componentWillMount() {
    _grid = Grid.getInstance()
  }

  clickCell(i,x,isAvailable) {
    if(isAvailable) {
      this.props.move({x: i, y: x})
    }
    else {
      this.props.aim({x: i, y: x})
    }
  }

  getRandomObstacleCell() {
    return 'gridItemObstacle0'
    // return 'gridItemObstacle' + Math.floor(Math.random() * 3)
  }

  getCell(cell) {
    return !cell.diffCell ? 'gridItem' : 'gridItem dirtPatch'
  }

  renderExplosion(isExploding) {
    if (!isExploding) {
      return null;
    }
    return (
      <div className='explosion' />
    )
  }

  renderGround() {
    let amount = _grid.getDivider()
    let rows = _grid.getRows()
    let cols = _grid.getCols()
    let size = Dimensions().width / amount
    let grid = []
    let borderColor = '#efefef'

    const cellStyle = {
      display: 'flex', fontSize:10, color: '#ccc',width: size, height: size, background: 'black', border: '0px solid ' + borderColor
    }

    for (let i = 0; i < cols; i++) {
      let row = []
      for (let x = 0; x < rows; x++) {
        var cell = _grid.getGrid()[i][x]
        if(cell.obstacle && cell.showObstacle) {
          row.push(<div key={x} style={{ ...cellStyle, background: 'black' }} onClick={() => this.clickCell(x,i,false)}>
            <div className={this.getRandomObstacleCell()} style={{opacity: cell.opacity, flex:1, border: '0px dashed #7d725f', color: 'white'}}>
              {this.renderExplosion(cell.isExploding)}
            </div>
          </div>)
        }
        else {
          row.push(<div key={x} style={{ ...cellStyle }} onClick={() => this.clickCell(x,i,true)}>
          <div className={this.getCell(cell)} style={{opacity: cell.opacity, 'transition': 'all .3s ease-in-out', 'transitionDelay': '.5s', flex:1, border: '0px dashed #7d725f'}}></div>
          </div>)
        }
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
    let size = Dimensions().width / amount
    let rows = _grid.getRows()
    let cols = _grid.getCols()
    let grid = []
    let borderColor = '#efefef'

    const cellStyle = {
      display: 'flex', fontSize:12, color: '#05e400',width: size, height: size, background: 'transparent', border: '0px solid ' + borderColor
    }

    for (let i = 0; i < cols; i++) {
      let row = []
      for (let x = 0; x < rows; x++) {

        var cell = _grid.getGrid()[i][x]
        var a = false
        if(a && this.isCellInUse(i,x) ) {
          row.push(
            <div key={x} style={{ ...cellStyle, background: 'transparent', color: '#05e400' }} onClick={() => this.clickCell(x,i)}>
              <div className='debugItemCell' style={{flex:1, color: '#05e400', border: '1px solid #ffffff', flexDirection: 'row'}}>
              </div>
            </div>
          )
        }
        else if(cell.isPath && cell.isPathDirectionTurn) {
          row.push(
            <div key={x} style={{ ...cellStyle, background: 'transparent', color: '#05e400' }} onClick={() => this.clickCell(x,i)}>
              <div className='debugItemCell' style={{flex:1, color: '#05e400', border: '1px solid yellow', flexDirection: 'row'}}>
              </div>
            </div>
          )
        }
        else if(cell.isPath) {
          row.push(
            <div key={x} style={{ ...cellStyle, background: 'rgba(255,0,0,.05)', color: '#05e400' }} onClick={() => this.clickCell(x,i)}>
              <div className='debugItemCell' style={{flex:1, color: '#eb840c', border: '1px dotted red', flexDirection: 'row'}}>
              {cell.tempPathString}
              </div>
            </div>
          )
        }
        else {
          // {cell.x}, {cell.y}
          row.push(
            <div key={x} style={{ ...cellStyle }} onClick={() => this.clickCell(x,i)}>
              <div style={{opacity: 1, flex:1, border: '1px solid black', flexDirection: 'row', justifyContent: 'space-around'}}>
                <div style={{display: 'flex', flex:1, background: 'transparent', height: size / 2, flexDirection: 'row'}}>
                  <div style={{display: 'flex', flex:1, background: 'transparent', width: size / 2}}>
                    <span className="cell xy"></span>
                  </div>
                  <div style={{display: 'flex', flex:1, background: 'transparent', width: size / 2, justifyContent: 'flex-end'}}>
                    <span className="cell fval">F:{cell.f}</span>
                  </div>
                </div>
                <div style={{display: 'flex', flex:1, background: 'transparent', height: size / 2, flexDirection: 'row'}}>
                  <div style={{display: 'flex', flex:1, background: 'transparent', width: size / 2, alignItems:'flex-end'}}>
                    <span className="cell gval">G:{cell.g}</span>
                  </div>
                  <div style={{display: 'flex', flex:1, background: 'transparent', width: size / 2, justifyContent: 'flex-end', alignItems:'flex-end'}}>
                    <span className="cell hval">H:{cell.h}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      }
      grid.push(<div key={i} style={{flexDirection: 'row'}}>{row}</div>)
    }
    return grid
  }

  render() {
    return (
      <div className='ground'>
        <div className={this.props.cursor} style={{display: 'flex', width: Dimensions().width, height: Dimensions().height, flexDirection: 'row'}}>
          {this.renderGround()}
        </div>
        <div style={{
          display: 'flex', position: 'absolute', top: 0, left: 0, opacity: 1,
          width: Dimensions().width, height: Dimensions().height, flexDirection: 'row',
          pointerEvents: 'none'
        }}>
          {this.props.debug ? this.renderDebug() : null}
        </div>
      </div>
    )
  }
}

export default Ground
