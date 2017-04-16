import React from 'react';
import TrackPattern from './TrackPattern'

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
class Tracks extends React.Component {
  //_____________________________________________________________________________________________________
  shouldComponentUpdate() {
    return false
  }
  //_____________________________________________________________________________________________________
  render() {
    let w = 20
    let h = this.props.specs.height
    let trackLip = 4

    const trackStyleLeft = {
      width: w, height: h + trackLip, background: '#232323',
      position: 'absolute', top: 0 - trackLip, left:-w, borderRadius: 4, zIndex:-3, border: '1px solid #000'
    }
    const trackStyleRight = {
      width: w, height: h + trackLip, background: '#232323',
      position: 'absolute', top: 0 - trackLip, left: this.props.specs.width, borderRadius: 4, zIndex:-3, border: '1px solid #000'
    }
    return (
      <div style={{position: 'relative'}}>
      <div style={{...trackStyleLeft}}><TrackPattern trackHeight={h + trackLip} trackWidth={w}/></div>
      <div style={{...trackStyleRight}}><TrackPattern trackHeight={h + trackLip} trackWidth={w}/></div>
      </div>
    )
  }
}

export default Tracks
