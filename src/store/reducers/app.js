
const tank1 = {
  width: 55,
  height: 60,
  background: '#CCC',
  cabineColor: '#CCC',
  cannonColor: '#CCC',
  rotation: {
    body: 0,
    cannon: 0
  },
  position: {x: 7, y:4}
}

const tank2 = {
  width: 40,
  height: 40,
  background: '#685238',
  cabineColor: '#685238',
  cannonColor: '#685238',
  rotation: {
    body: 0,
    cannon: 0
  },
  position: {x:1, y:1}
}

const tank3 = {
  width: 40,
  height: 40,
  background: '#685238',
  cabineColor: '#685238',
  cannonColor: '#685238',
  rotation: {
    body: 0,
    cannon: 0
  },
  position: {x:4, y:3}
}

const initState = {
  firedUp: false,
  tanks: [tank1, tank2, tank3]
}
const appReducer = (state = initState, action) => {
  // console.log('action', action)
  switch (action.type) {
    case 'INIT':
      let r = Object.assign(state, {firedUp: true})
      console.log(r)
      return r
    default:
      return state
  }
}

export default appReducer
