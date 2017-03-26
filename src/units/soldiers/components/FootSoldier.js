import React from 'react'
import '../../../css/FootSoldier.css';
import '../../../css/App.css';
export default class FootSoldier extends React.Component {
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

  getCSS() {
    let animation = ''
    if(this.props.isShooting === true) {
      animation = ' shooting'
    }
    else if(this.props.isMoving === true && this.props.isShooting === false) {
      animation = ' walking'
    }

    return 'unit' + animation
  }

  lasersight() {
    if(!this.props.debugAim) {
      return null
    }
    return (
      <div className='lasersight soldierSight' />
    )
  }

  render() {
    return (
        <div className="unitWrapper" style={{transform: 'rotate(' + this.state.rotation + 'deg)', 'transition': 'all ' + this.props.specs.aimDuration / 1000 + 's ease'}}>
          <div id="soldier" className={this.getCSS()}>
            <div className="gunWrapper">
              <div className="gun" style={{background: this.props.specs.weaponColor}}>
                <div className="barrel" style={{background: this.props.specs.barrelColor}}/>
              </div>
            </div>
            <div className="body" style={{background: this.props.specs.torsoColor}}>
              <div className="arms" style={{background: this.props.specs.shoulderColor}}>
                <div className="arm left" style={{background: this.props.specs.armsColor}}></div>
                <div className="arm right" style={{background: this.props.specs.armsColor}}></div>
              </div>
              <div className="head" style={{background: this.props.specs.headColor}}/>
            </div>
          </div>
          {this.lasersight()}
        </div>
    )
  }
}
