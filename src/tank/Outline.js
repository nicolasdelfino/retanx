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
    const w = this.props.specs.width + 60
    const h = this.props.specs.height + 30

    const outlineStyle = {
      position: 'absolute',
      left: this.props.position.x - 30, top: this.props.position.y - 15,
      width: w, height: h, opacity: 1, animation: 'fade 1s linear infinite',
      zIndex: 100, transform: 'rotate(' + this.state.rotation + 'deg)', borderRadius: 2,
      border: '2px solid #0069e4', background: 'transparent', 'transition': 'all 2s ease', transitionDelay: '0s'
    }

    if(!this.props.specs.selected) {
      return null
    }

    return (
      <div style={{...outlineStyle}} />
    )
  }
}

export default Outline
