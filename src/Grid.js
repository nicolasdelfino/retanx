import React from 'react';

import DIMENSIONS from './Dimensions'

// GRID

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.clickCell = this.clickCell.bind(this)
  }

  clickCell(i,x) {
    let size = DIMENSIONS().width / 10
    console.log('you clicked cell: [' + i + '][' + x + ']')
    console.log('pixels x:', i * size, 'pixels y:', x * size)
  }

  renderGrid() {
    let w = DIMENSIONS().width / 10
    let h = DIMENSIONS().height / 10
    let cols = h / 10
    let rows = w / 10
    let c = []
    let borderColor = '#efefef'

    const cellStyle = {
      display: 'flex', fontSize:10, color: '#ccc',width: w, height: w, background: 'black', border: '0px solid ' + borderColor
    }

    console.log('rows', rows, 'cols', cols)
    for (let i = 0; i < rows; i++) {
      let row = []
      for (let x = 0; x < cols; x++) {
        row.push(<div key={x} style={{ ...cellStyle }} onClick={() => this.clickCell(x,i)}>
        <div style={{opacity: 0.1, flex:1, border: '1px solid white'}}>x: {i} y: {x}</div>
        </div>)
      }
      c.push(<div key={i} style={{flexDirection: 'row'}}>{row}</div>)
    }

    console.log(c)
    return c
  }
  render() {
    return (
      <div style={{display: 'flex', width: DIMENSIONS().width, height: DIMENSIONS().height, flexDirection: 'row'}}>
      {this.renderGrid()}
      </div>
    )
  }
}

export default Grid
