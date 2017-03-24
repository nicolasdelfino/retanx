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
              <div className="gun">
                <div className="barrel" />
              </div>
            </div>
            <div className="body">
              <div className="arms">
                <div className="arm left"></div>
                <div className="arm right"></div>
              </div>
              <div className="head" />
            </div>
          </div>
          {this.lasersight()}
        </div>
    )
  }
}
