import React from 'react';
class Tank extends React.Component {
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

    const tankStyle = {
      width: this.props.specs.width, height: this.props.specs.height,
      borderRadius: 0, zoom: zoom, zIndex: 100, transform: 'rotate(' + this.state.rotation + 'deg)', boxShadow: '0px 0px 20px #000',
      border: '0px solid #000',
      background: this.props.specs.background, 'transition': 'all 3s ease-out', transitionDelay: '0s'
    }
    return (
      <div style={{...tankStyle}}>
       <div style={{color: '#000'}}>{this.props.children}</div>
      </div>
    )
  }
}

export default Tank
