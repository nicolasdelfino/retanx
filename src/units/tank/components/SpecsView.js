import React from 'react';

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
class SpecsView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rotation: this.props.rotation
    }
  }
  //_____________________________________________________________________________________________________
  componentWillReceiveProps(props) {
    if(props.rotate === true) {
      this.setState({ rotation: props.rotation })
    }
  }
  //_____________________________________________________________________________________________________
  render() {
    const w = this.props.specs.cellWidth
    const h = this.props.specs.cellHeight

    const specsAreaStyle = {
      position: 'absolute',
      left: this.props.position.x - 25, top: this.props.position.y - 25,
      width: w, height: h,
      zIndex: 300, transform: 'rotate(' + this.state.rotation + 'deg)',
      background: 'transparent', 'transition': 'all 2s ease', pointerEvents: 'none'
    }

    const specsStyle = {
      position: 'absolute',
      left: 0, top: 0,
      width: 10, height: 10, borderRadius: 10,
      zIndex: 101, transform: 'rotate(' + this.state.rotation + 'deg)', border: '1px solid #2c9a23',
      background: 'rgb(0, 0, 0)', 'transition': 'all 1s ease', pointerEvents: 'auto', cursor: 'pointer'
    }

    if(!this.props.specs.selected) {
      return null
    }

    return (
      <div style={{...specsAreaStyle}}>
        <div style={{...specsStyle}} onClick={(e) => {
          console.log('specs click')
          this.props.details()
        }}/>
      </div>
    )
  }
}

export default SpecsView
