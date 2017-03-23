import React from 'react';
class TrackPattern extends React.Component {
  tracks() {
    let trackHeight = 2
    let t = []
    for (var i = 0; i < this.props.trackHeight / trackHeight; i++) {
      let color = i % 2 ? '#000' : '#383434'
      t.push(<div key={i} style={{width: this.props.trackWidth, height: trackHeight, background: color}} />)
    }

    return t
  }
  render() {
    return (<div>{this.tracks()}</div>
    )
  }
}

export default TrackPattern
