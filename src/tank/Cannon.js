import React from 'react';
class Cannon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rotation: this.props.rotation
    }
  }

  componentWillReceiveProps(props) {
    if(props.rotate === 'true') {
      this.setState({ rotation: props.rotation })
    }
  }

  render() {
    const cannonSpecs = {
      width: 10,
      height: this.props.specs.height + 10
    }

    // console.warn('ROTATION ====', this.props.rotation)
    let w = this.props.specs.width * 1
    let _w = this.props.specs.width - w

    let h = this.props.specs.height * 1
    let _h = this.props.specs.height - h

    let outer = {
      width: w, height: h,
      background: this.props.specs.cabineColor, position: 'absolute', left: Math.round(_w) / 4, top: Math.floor(_h) / 2, boxShadow: 'inset 0 0 20px #000, inset 0 0 20px #000, inset 0 0 20px #fff',
      transform: 'rotate(' + this.state.rotation + 'deg)', zIndex: 10, 'transition': 'all 1.5s ease', borderRadius: this.props.specs.width * 0.1
    }

    let roundSize = this.props.specs.width / 1.5
    let cannonSize = 60

    let round = {
      width: roundSize, height: roundSize, background: this.props.specs.cabineColor, borderRadius: 0.2 * roundSize,
      position: 'absolute', left: 'calc(50% - ' + roundSize / 2 + 'px)', top: 'calc(50% - ' + roundSize / 2 + 'px)',
      border: '0px solid rgba(0,0,0,0.5)', zIndex: 10, boxShadow: 'inset 0 0 10px #000, inset 0 0 20px #262626, inset 0 0 20px' + this.props.specs.cabineColor
    }

    let inner = {
      width: cannonSpecs.width, height: cannonSize, background: this.props.specs.cannonColor, borderRadius: 0,
      position: 'absolute', left: 'calc(50% - ' + (cannonSpecs.width + 2) / 2 + 'px)', top: this.props.specs.height / 2,
      border: '2px solid black', boxShadow: 'inset 0 0 10px #000, inset 0 0 20px #000, inset 0 0 2px ' + this.props.specs.cannonColor

    }

    return (
      <div style={{...outer, zIndex: 100}}>
        <div style={{...round}} />
        <div style={{...inner}} />
      </div>
    )
  }
}

export default Cannon
