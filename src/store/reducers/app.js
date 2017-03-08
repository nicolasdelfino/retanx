//import ReduxThunk from 'redux-thunk'

const initState = {
  firedUp: false,
  aimTarget: {x: 0, y: 0},
  position: {x:4, y:3},
  lastPosition: {},
  width: 55,
  height: 60,
  background: '#685238',
  cabineColor: '#685238',
  cannonColor: '#685238',
  rotate: 'true'

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
    default:
      return state
  }
}

export default tank
