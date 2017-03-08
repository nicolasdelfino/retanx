//import ReduxThunk from 'redux-thunk'
// background: '#46341f',
// cabineColor: '#624728',
// cannonColor: '#685238',
const initState = {
  firedUp: false,
  aimTarget: {x: 0, y: 0},
  position: {x:4, y:3},
  lastPosition: {},
  width: 50,
  height: 65,
  cannonSize: 70,
  background: '#464645',
  cabineColor: '#524d48',
  cannonColor: '#696868',
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
