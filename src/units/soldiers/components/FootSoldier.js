import React from 'react'
import '../../../css/FootSoldier.css';
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

  render() {
    return (
        <div className="unitWrapper shooting" style={{transform: 'rotate(' + this.state.rotation + 'deg)'}}>
          <div id="soldier" className="unit">
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
        </div>
    )
  }
}
