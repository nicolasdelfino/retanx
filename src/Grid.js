import React from 'react';

import DIMENSIONS from './Dimensions'

// GRID

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.clickCell = this.clickCell.bind(this)
  }

  clickCell(i,x) {
    this.props.aim({x: i, y: x})
  }

  // shouldComponentUpdate() {
  //   return false
  // }

  renderGrid() {
    let amount = 10
    let w = DIMENSIONS().width / amount
    let h = DIMENSIONS().height / amount
    let cols = h / (amount)
    let rows = w / (amount)
    let grid = []
    let borderColor = '#efefef'

    const cellStyle = {
      display: 'flex', fontSize:10, color: '#ccc',width: w, height: w, background: 'black', border: '0px solid ' + borderColor
    }

    // console.log('rows', rows, 'cols', cols) x: {i} y: {x}
    for (let i = 0; i < rows; i++) {
      let row = []
      for (let x = 0; x < cols; x++) {
        row.push(<div key={x} style={{ ...cellStyle }} onClick={() => this.clickCell(x,i)}>
        <div className='gridItem' style={{opacity: 0.45, flex:1, border: '2px dashed rgba(0,0,0,0)'}}></div>
        </div>)
      }
      grid.push(<div key={i} style={{flexDirection: 'row'}}>{row}</div>)
    }

    return grid
  }

  render() {
    console.log('cursor', this.props.cursor)
    return (
      <div className={this.props.cursor} style={{display: 'flex', width: DIMENSIONS().width, height: DIMENSIONS().height, flexDirection: 'row'}}>
      {this.renderGrid()}
      </div>
    )
  }
}

export default Grid
