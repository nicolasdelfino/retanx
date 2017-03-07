import React from 'react';
import TrackPattern from './TrackPattern'

class Tracks extends React.Component {
  render() {
    let w = 10
    let h = this.props.specs.height
    let trackLip = 5

    const trackStyleLeft = {
      width: w, height: h + trackLip, background: '#232323',
      position: 'absolute', top: - h - trackLip/2, left:-w, borderRadius: 4, zIndex:-3, border: '1px solid #000'
    }
    const trackStyleRight = {
      width: w, height: h + trackLip, background: '#232323',
      position: 'absolute', top: - h - trackLip/2, left: this.props.specs.width, borderRadius: 4, zIndex:-3, border: '1px solid #000'
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
