import React from 'react';
class Tank extends React.Component {
  render() {

    const zoom = 1

    const tankStyle = {
      width: this.props.specs.width, height: this.props.specs.height,
      borderRadius: 0, zoom: zoom, zIndex: 100, transform: 'rotate(' + this.props.rotation + 'deg)', boxShadow: '0px 0px 0px #000',
      position: 'absolute', left: this.props.position.x, top: this.props.position.y, border: '1px solid #000',
      background: this.props.specs.background
    }
    return (
      <div style={{...tankStyle}}>
       <div style={{color: '#000'}}>{this.props.children}</div>
      </div>
    )
  }
}

export default Tank
