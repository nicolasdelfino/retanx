import React from 'react';
class Tank extends React.Component {
  render() {
    return (
      <div style={{
        position: 'absolute',
        left: this.props.position.x, top: this.props.position.y,
        'transition': 'all 1s ease'

      }}>
        {this.props.children}
      </div>
    )
  }
}

export default Tank
