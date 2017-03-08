import React from 'react';
class Body extends React.Component {
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

    const zoom = 1
    const w = this.props.specs.width
    const h = this.props.specs.height

    const tankStyle = {
      width: w, height: h,
      borderRadius: 0, zoom: zoom, zIndex: 100, transform: 'rotate(' + this.state.rotation + 'deg)',
      border: '0px solid #000', boxShadow: 'inset 0 0 10px #000, inset 0 0 20px #262626, inset 0 0 20px' + this.props.specs.cabineColor,
      background: this.props.specs.background, 'transition': 'all 2s ease-out', transitionDelay: '0s'
    }
    return (
      <div style={{...tankStyle}}>
       <div style={{color: '#000'}}>{this.props.children}</div>
      </div>
    )
  }
}

export default Body
