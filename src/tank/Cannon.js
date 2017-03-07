import React from 'react';
class Cannon extends React.Component {

  render() {

    const cannonSpecs = {
      width: 10,
      height: this.props.specs.height + 10
    }

    const outer = {
      width: this.props.specs.width, height: this.props.specs.height,
      background: 'transparent', position: 'relative', left: 0, top: 0, boxShadow: 'inset 0 0 20px #000, inset 0 0 20px #000, inset 0 0 20px #fff',
      transform: 'rotate(' + this.props.rotation + 'deg)'
    }

    let roundSize = this.props.specs.width / 1.5
    let cannonSize = 60

    const round = {
      width: roundSize, height: roundSize, background: this.props.specs.cabineColor, borderRadius: 0.2 * roundSize,
      position: 'absolute', left: 'calc(50% - ' + roundSize / 2 + 'px)', top: 'calc(50% - ' + roundSize / 2 + 'px)',
      border: '1px solid rgba(0,0,0,0.5)', zIndex: 10, boxShadow: 'inset 0 0 20px #000, inset 0 0 20px #000, inset 0 0 20px #fff'
    }

    const inner = {
      width: cannonSpecs.width, height: cannonSize, background: this.props.specs.cannonColor, borderRadius: 0,
      position: 'absolute', left: 'calc(50% - ' + cannonSpecs.width / 2 + 'px)', top: this.props.specs.height / 2,
      border: '1px solid rgba(0,0,0,0.5)', boxShadow: 'inset 0 0 15px #000, inset 0 0 5px #000, inset 0 0 5px #fff'

    }

    return (
      <div style={{...outer}}>
        <div style={{...round}} />
        <div style={{...inner}} />
      </div>
    )
  }
}

export default Cannon
