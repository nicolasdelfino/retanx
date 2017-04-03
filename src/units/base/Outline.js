import React from 'react';

class Outline extends React.Component {
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
    let w = this.props.specs.width * 1.5
    let h = this.props.specs.height * 1.2

    const outlineStyle = {
      width: w, height: h, opacity: 1, animation: 'fade 0.8s linear infinite',
      transform: 'rotate(' + this.state.rotation + 'deg)',
      border: '2px solid red', background: 'transparent'
    }

    if(!this.props.specs.selected) {
      return null
    }

    return (
      <div className='outline'
      style={{display: 'flex', position: 'absolute', left: this.props.position.x, top: this.props.position.y, zIndex: 300,
      'transition': 'all ' + this.props.moveSpeed/1000 +'s ease',
      width: this.props.specs.cellWidth, height: this.props.specs.cellHeight, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{...outlineStyle}} />
      </div>
    )
  }
}

export default Outline
