import React from 'react'

class HP extends React.Component {

  renderHP() {
    let r = []

    for(var i = 0; i < this.props.specs.hp; i++) {
      r.push(<div style={{outline: '1px solid white', dislay: 'flex', flex: 1, background: 'black'}} />)
    }

    return <div style={{display: 'flex', flex: 1, flexDirection: 'row'}}>{r}</div>
  }

  render() {
    return <div className='HP'
    style={{position: 'absolute', display: 'flex', top: 0, left: 0, background: 'transparent',width: this.props.specs.cellWidth, height: this.props.specs.cellHeight,
      zIndex: 10000, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex',width: this.props.specs.cellWidth * 0.5, height: 3, marginTop: - (this.props.specs.cellHeight - this.props.specs.height + 10),
        background: 'green', border: '1px solid white'}} />
        
    </div>
  }
}

export default HP
