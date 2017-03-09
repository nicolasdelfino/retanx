// width: 45,
// height: 65,
const initState = {
  firedUp: false,
  aimTarget: {x: 0, y: 0},
  position: {x:4, y:3},
  lastPosition: {},
  width: 45,
  height: 65,
  cannonSize: 90,
  background: '#383838',
  cabineColor: '#383838',
  cannonColor: '#696868',
  rotate: 'true',
  selected: false
}

const tank = (state = initState, action) => {
  // console.log('action', action)
  switch (action.type) {
    case 'AIM':
      return {
        ...state,
        aimTarget: { x:action.payload.y, y: action.payload.x },
        rotate: 'true'
    }
    case 'MOVE':
      return {
        ...state,
        position: { x:action.payload.y, y: action.payload.x },
        rotate: 'false'
    }
    case 'SELECT':
      let current = state.selected
      return {
        ...state, selected: !current
    }
    default:
      return state
  }
}

export default tank
