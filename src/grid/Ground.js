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
    return 'gridItem tileObstacle'
    // return 'gridItemObstacle' + Math.floor(Math.random() * 3)
  }

  renderExplosion(isExploding) {
    if (!isExploding) {
      return null;
    }
    return (
      <div className='explosion' />
    )
  }

  ////////////////////////////////////////////////////////////////////////////////////////////
  // GROUND

  renderGround() {
    let rows = _grid.getRows()
    let cols = _grid.getCols()
    let size = Dimensions().tileSize
    let grid = []
    let borderColor = 'rgb(239,239,239)'

    const cellStyle = {
      display: 'flex', fontSize:10, color: 'rgb(204,204,204)',width: size, height: size, background: 'rgb(0,0,0)', border: '0px solid ' + borderColor
    }

    for (let i = 0; i < cols; i++) {
      let row = []
      for (let x = 0; x < rows; x++) {
        let cell = _grid.getGrid()[i][x]
        if(cell.obstacle) {
          row.push(<div key={x} style={{ ...cellStyle, background: 'rgb(0,0,0)' }} onClick={() => this.clickCell(x,i,false)}>
            <div className={'gridItem ' + cell.cssClass} style={{opacity: cell.opacity, flex:1, border: '0px dashed rgba(0,0,0,0)', color: 'rgb(255,255,255)', backgroundSize: size + 'px ' + size + 'px'}}>
              {this.renderExplosion(cell.isExploding)}
            </div>
          </div>)
        }
        else if(cell.showRuins){
          row.push(<div key={x} style={{ ...cellStyle }} onClick={() => this.clickCell(x,i,true)}>
            <div className='gridItem tileBurned' style={{opacity: cell.opacity, 'transition': 'all .2s ease-in-out', 'transitionDelay': '.1s', flex:1, border: '0px dashed transparent', backgroundSize: size + 'px ' + size + 'px'}}>
              {this.renderExplosion(cell.isExploding)}
            </div>
          </div>)
        }
        else {
          row.push(<div key={x} style={{ ...cellStyle }} onClick={() => this.clickCell(x,i,true)}>
            <div className='gridItem' style={{opacity: cell.opacity, 'transition': 'all .2s ease-in-out', 'transitionDelay': '.1s', flex:1, border: '0px dashed transparent', backgroundSize: size + 'px ' + size + 'px'}}>
              {this.renderExplosion(cell.isExploding)}
            </div>
          </div>)
        }
      }
      grid.push(<div key={i} style={{flexDirection: 'row'}}>{row}</div>)
    }
    return grid
  }

  isCellInUse(x,y) {
    let inUse = false
    this.props.units.forEach((tank) => {
      if(tank.position.x === x && tank.position.y === y) {
        inUse = true
      }
    })

    return inUse
  }

  ////////////////////////////////////////////////////////////////////////////////////////////
  // DEBUG A*

  renderDebug() {
    let size = Dimensions().tileSize
    let rows = _grid.getRows()
    let cols = _grid.getCols()
    let grid = []
    let borderColor = 'rgb(239,239,239)'

    const cellStyle = {
      display: 'flex', fontSize:12, color: 'rgb(5,228,0)',width: size, height: size, background: 'rgba(0,0,0,0)', border: '0px solid ' + borderColor
    }

    for (let i = 0; i < cols; i++) {
      let row = []
      for (let x = 0; x < rows; x++) {

        var cell = _grid.getGrid()[i][x]
        var a = false
        if(a && this.isCellInUse(i,x) ) {
          row.push(
            <div key={x} style={{ ...cellStyle, background: 'rgba(0,0,0,0)', color: 'rgb(5,228,0)' }} onClick={() => this.clickCell(x,i)}>
              <div className='debugItemCell' style={{flex:1, color: 'rgb(5,228,0)', border: '0px solid rgba(0,0,0,0)', flexDirection: 'row'}}>
              </div>
            </div>
          )
        }
        else if(cell.isPath && cell.isPathDirectionTurn) {
          row.push(
            <div key={x} style={{ ...cellStyle, background: 'rgba(0,0,0,0)', color: 'rgb(5,228,0)' }} onClick={() => this.clickCell(x,i)}>
              <div className='debugItemCell' style={{flex:1, color: 'rgb(5,228,0)', border: '0px solid rgba(0,0,0,0)', flexDirection: 'row'}}>
              </div>
            </div>
          )
        }
        else if(cell.isPath) {
          row.push(
            <div key={x} style={{ ...cellStyle, background: 'rgba(255,0,0,0.05)', color: 'rgb(5,228,0)' }} onClick={() => this.clickCell(x,i)}>
              <div className='debugItemCell' style={{flex:1, color: 'rgb(235,132,12)', border: '1px dashed rgb(255,0,0)', flexDirection: 'row'}}>
              {cell.tempPathString}
              </div>
            </div>
          )
        }
        else {
          // {cell.x}, {cell.y}
          row.push(
            <div key={x} style={{ ...cellStyle }} onClick={() => this.clickCell(x,i)}>
              <div style={{opacity: 1, flex:1, border: '1px solid rgba(0,0,0,0)', flexDirection: 'row', justifyContent: 'space-around'}}>
                <div style={{display: 'flex', flex:1, background: 'rgba(0,0,0,0)', height: size / 2, flexDirection: 'row'}}>
                  <div style={{display: 'flex', flex:1, background: 'rgba(0,0,0,0)', width: size / 2}}>
                    <span className="cell xy" style={{display: this.props.ascores ? 'flex' : 'none'}}></span>
                  </div>
                  <div style={{display: 'flex', flex:1, background: 'rgba(0,0,0,0)', width: size / 2, justifyContent: 'flex-end'}}>
                    <span className="cell fval" style={{display: this.props.ascores ? 'flex' : 'none'}} >F:{cell.f}</span>
                  </div>
                </div>
                <div style={{display: 'flex', flex:1, background: 'rgba(0,0,0,0)', height: size / 2, flexDirection: 'row'}}>
                  <div style={{display: 'flex', flex:1, background: 'rgba(0,0,0,0)', width: size / 2, alignItems:'flex-end'}}>
                    <span className="cell gval" style={{display: this.props.ascores ? 'flex' : 'none'}} >G:{cell.g}</span>
                  </div>
                  <div style={{display: 'flex', flex:1, background: 'rgba(0,0,0,0)', width: size / 2, justifyContent: 'flex-end', alignItems:'flex-end'}}>
                    <span className="cell hval" style={{display: this.props.ascores ? 'flex' : 'none'}} >H:{cell.h}</span>
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

  ////////////////////////////////////////////////////////////////////////////////////////////
  // DEBUG OBSTACLES

  renderDebugObstacles() {
    let size = Dimensions().tileSize
    let rows = _grid.getRows()
    let cols = _grid.getCols()
    let grid = []

    const cellStyle = {
      display: 'flex', width: size, height: size, background: 'rgba(0,126,228,0.1)', outline: '1px solid #007ee4'
    }

    for (let i = 0; i < cols; i++) {
      let row = []
      for (let x = 0; x < rows; x++) {
        var cell = _grid.getGrid()[i][x]
        if( cell.obstacle || cell.unitObstacle) {
          row.push(
            <div key={x} style={{ ...cellStyle}}>
              <div style={{flex:1, flexDirection: 'row'}}>
              </div>
            </div>
          )
        }
        else {
          row.push(
            <div key={x} style={{ ...cellStyle, background: 'rgba(0,0,0,0)', outline: 'none'}}>
              <div style={{flex:1, flexDirection: 'row'}}>
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

        <div style={{
          display: 'flex', position: 'absolute', top: 0, left: 0, opacity: 1,
          width: Dimensions().width, height: Dimensions().height, flexDirection: 'row',
          pointerEvents: 'none'
        }}>
          {this.props.debugObstacles ? this.renderDebugObstacles() : null}
        </div>
      </div>
    )
  }
}

export default Ground
