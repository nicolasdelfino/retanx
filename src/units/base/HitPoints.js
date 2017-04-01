import React from 'react'

class HP extends React.Component {

  renderHPBarOverlay() {
    let r = []
    for(var i = 0; i < this.props.specs.hp; i++) {
      r.push(<div key={i} style={{borderRight: i === this.props.specs.hp - 1 ? '1px solid transparent' : '1px solid #bbff3c', dislay: 'flex', flex: 1, background: 'transparent'}} />)
    }
    return <div style={{zIndex: 100, display: 'flex', flex: 1, flexDirection: 'row'}}>{r}</div>
  }

  renderHealth() {
    let health = Math.ceil(this.props.specs.health / this.props.specs.maxHealth * 100);
    return (
      <div style={{ position: 'absolute', zIndex: 90, width: 60, height: 4}}>
        <div style={{ height: '100%', width: health+'%', backgroundColor: 'green' }}></div>
      </div>
    )
  }

  render() {
    if(!this.props.specs.alive || (this.props.specs.health <= 0)) {
      return null
    }

    return <div className='HP'
    style={{position: 'absolute', display: 'flex', top: 0, left: 0, background: 'transparent',
    width: this.props.specs.cellWidth, height: this.props.specs.cellHeight,
    zIndex: 10000, alignItems: 'center', justifyContent: 'center'}}>

      <div style={{display: 'flex',width: 60, height: 4, outline: '1px solid #bbff3c', position: 'absolute', top: this.props.specs.hpPosTop }}>
        {this.renderHealth()}
        {this.renderHPBarOverlay()}
      </div>
    </div>
  }
}

export default HP
