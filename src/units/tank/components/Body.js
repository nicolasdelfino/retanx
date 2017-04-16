import React from 'react';

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
class Body extends React.Component {
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
  render() {

    const zoom = 1
    const w = this.props.specs.width
    const h = this.props.specs.height

    const tankStyle = {
      width: w, height: h,
      borderRadius: 0, zoom: zoom, transform: 'rotate(' + this.state.rotation + 'deg)',
      border: '0px solid #000', boxShadow: '0px 0px 60px #000',
      background: this.props.specs.background, 'transition': 'all ' + this.props.specs.moveSpeed/1000 + 's ease-out', transitionDelay: '0s'
    }
    return (
      <div style={{display: 'flex', width: 100, height: 100, alignItems: 'center', justifyContent:'center', position: 'absolute'}}>
        <div style={{...tankStyle}}>
         <div style={{color: '#000'}}>{this.props.children}</div>
        </div>
      </div>
    )
  }
}

export default Body
