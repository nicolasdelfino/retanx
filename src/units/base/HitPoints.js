import React from 'react'

class HP extends React.Component {

  renderHP() {
    let r = []
    for(var i = 0; i < this.props.specs.hp; i++) {
      r.push(<div key={i} style={{outline: '1px solid #e8ff77', dislay: 'flex', flex: 1, background: 'green'}} />)
    }
    return <div style={{display: 'flex', flex: 1, flexDirection: 'row'}}>{r}</div>
  }

  render() {
    return <div className='HP'
    style={{position: 'absolute', display: 'flex', top: 0, left: 0, background: 'transparent',
    width: this.props.specs.cellWidth, height: this.props.specs.cellHeight,
    zIndex: 10000, alignItems: 'center', justifyContent: 'center'}}>

      <div style={{display: 'flex',width: 60, height: 4, position: 'absolute', top: this.props.specs.hpPosTop,
        background: 'green', border: '1px solid #ddff36'}}>

        {this.renderHP()}

      </div>
    </div>
  }
}

export default HP
