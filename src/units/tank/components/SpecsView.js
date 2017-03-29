import React from 'react';

class SpecsView extends React.Component {
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
    const w = this.props.specs.width + 60
    const h = this.props.specs.height + 30

    const specsAreaStyle = {
      position: 'absolute',
      left: this.props.position.x - 30, top: this.props.position.y - 15,
      width: w, height: h,
      zIndex: 300, transform: 'rotate(' + this.state.rotation + 'deg)',
      background: 'transparent', 'transition': 'all 2s ease', pointerEvents: 'none'
    }

    const specsStyle = {
      position: 'absolute',
      left: 0, top: 0,
      width: 20, height: 20, borderRadius: 20,
      zIndex: 101, transform: 'rotate(' + this.state.rotation + 'deg)', border: '1px solid #2c9a23',
      background: 'transparent', 'transition': 'all 2s ease', pointerEvents: 'auto', cursor: 'pointer'
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
