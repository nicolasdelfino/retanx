import React from 'react';
class HealthBar extends React.Component {
  render() {
    if (this.props.unit.health >= this.props.unit.maxHealth)
      return null;
    let health = Math.ceil(this.props.unit.health / this.props.unit.maxHealth * 100);
    return (
      <div style={{ position: 'relative', width: '90px', height: '5px', top: '90px', left: '5px', backgroundColor: 'black', opacity: '0.6' }}>
        <div style={{ height: '100%', width: health+'%', backgroundColor: 'green' }}></div>
      </div>
    )
  }
}

export default HealthBar
