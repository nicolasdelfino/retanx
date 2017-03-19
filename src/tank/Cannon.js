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
      width: 8,
      height: this.props.specs.height + 10
    }

    let w = this.props.specs.width + 8
    let h = this.props.specs.height - 12

    let outer = {
      width: w, height: h,
      background: this.props.specs.cabineColor, position: 'absolute', left: 'calc(50% - ' + (w) / 2 + 'px)', top: 'calc(50% - ' + (h) / 2 + 'px)',
      boxShadow: 'inset 0 0 10px #000, inset 0 0 10px #000, inset 0 0 10px rgba(0,0,0,0.8)',
      transform: 'rotate(' + this.state.rotation + 'deg)', zIndex: 10, 'transition': 'all 0.5s ease', borderRadius: 10
    }

    let roundSize = this.props.specs.width / 1.5
    let hatchSize = this.props.specs.width / 4
    let hatchKnobSize = hatchSize / 5
    let cannonSize = this.props.specs.cannonSize

    let round = {
      width: roundSize, height: roundSize, background: this.props.specs.cabineColor, borderRadius: 0.2 * roundSize,
      position: 'absolute', left: 'calc(50% - ' + roundSize / 2 + 'px)', top: 'calc(50% - ' + roundSize / 2 + 'px)',
      border: '0px solid rgba(0,0,0,0.5)', zIndex: 10, boxShadow: 'inset 0 0 10px #000, inset 0 0 20px #262626, inset 0 0 20px' + this.props.specs.cabineColor
    }

    let inner = {
      width: cannonSpecs.width, height: cannonSize, background: this.props.specs.cannonColor, borderRadius: 0,
      position: 'absolute', left: 'calc(50% - ' + (cannonSpecs.width + 2) / 2 + 'px)', top: this.props.specs.height / 2,
      border: '2px solid black', boxShadow: 'inset 0 0 25px #000, inset 0 0 0px #000, inset 0 0 0px ' + this.props.specs.cannonColor
    }

    let hatch = {
      width: hatchSize, height: hatchSize, background: this.props.specs.cabineColor, borderRadius: 0.25 * hatchSize,
      position: 'absolute', left: 'calc(50% - ' + Math.floor((hatchSize + 4) / 2) + 'px)', top: 'calc(50% - ' + Math.floor((hatchSize + 2) / 2) + 'px)',
      border: '2px solid rgba(0,0,0,0.3)', zIndex: 10}

    let hatchKnob = {
      width: hatchKnobSize, height: hatchKnobSize, background: this.props.specs.cabineColor, borderRadius: 0.25 * hatchKnobSize,
      position: 'absolute', left: 'calc(50% - ' + Math.floor((hatchKnobSize + 2) / 2) + 'px)', top: 'calc(50% - ' + Math.floor((hatchKnobSize + 2) / 2) + 'px)',
      border: '1px solid rgba(0,0,0,0.3)', zIndex: 10}

    return (
      <div style={{...outer, zIndex: 100}}>
        <div style={{...round}} />
        <div style={{...inner}} />
        <div style={{...hatch}} />
        <div style={{...hatchKnob}} />
      </div>
    )
  }
}

export default Cannon
