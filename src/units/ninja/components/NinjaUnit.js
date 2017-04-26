import React from 'react'
import '../../../css/NinjaUnit.css';
import '../../../css/App.css';

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
export default class NinjaUnit extends React.Component {
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
  getAnimation() {
    return this.props.isMoving ? 'unit walking' : 'unit idle'
  }
  //_____________________________________________________________________________________________________
  renderUnit() {
    return (
      <div className="unitWrapper" style={{transform: 'rotate(' + this.state.rotation + 'deg)', 'transition': 'all ' + this.props.specs.aimDuration / 1000 + 's ease'}}>
      <div className="main">
        <div className="unitWrapper">

          <div id="soldier" className={this.getAnimation()}>
            <div className="body">

              <div className="arms">
                <div className="arm left"></div>
                <div className="arm right"></div>

              </div>
              <div className="legs">
                <div className="leg left"></div>
                <div className="leg right">
                  <div className="sword">
                    <div className="blade">
                      <div className="handle">
                        <div className="guard">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="head" />
              <div className="bandana">
                <div className="knot">
                  <div className="bowWrapper">
                    <div className="bowLeft" />
                    <div className="bowRight" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
    )
  }

  render() {
    return <div>{this.renderUnit()}</div>
  }
}
