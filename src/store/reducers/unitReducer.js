const initState = {
  shooting: false,
  isMoving: false,
  isAnimating: false,
  animation: 'idle',
  units: []
}

const unitReducer = (state = initState, action) => {
  let specs = null
  switch (action.type) {
    case 'ADD_UNIT':
    return {
      ...state,
      units: [...state.units, action.payload],
    }
    case 'AIM':
    specs = state.units[action.payload.id]
    return {
      ...state,
      units: [
        ...state.units.slice(0, action.payload.id),
        { ...specs, aimTarget: { x:action.payload.target.y, y: action.payload.target.x }, rotate: true, angle: action.payload.angle },
        ...state.units.slice(action.payload.id + 1),
      ],
    }
    case 'MOVE':
    specs = state.units[action.payload.id]
    return {
      ...state,
      units: [
        ...state.units.slice(0, action.payload.id),
        { ...specs, position: { x:action.payload.target.y, y: action.payload.target.x }, rotate: false },
        ...state.units.slice(action.payload.id + 1),
      ],
    }
    case 'SELECT_UNIT':
    specs = state.units[action.payload.id]
    return {
      ...state,
      units: [
        ...state.units.slice(0, action.payload.id),
        { ...specs, selected: true },
        ...state.units.slice(action.payload.id + 1),
      ],
    }
    case 'DESELECT_UNIT':
    specs = state.units[action.payload.id]
    return {
      ...state,
      units: [
        ...state.units.slice(0, action.payload.id),
        { ...specs, selected: false },
        ...state.units.slice(action.payload.id + 1),
      ],
    }
    case 'DESELECT_ALL_BUT_ID':
    if(state.units.length === 1) {
      return state
    }

    let ex = state.units.map((unit) => {
      unit.selected = unit.id === action.payload.id
      return unit
    })

    return {
      units: ex
    }
    case 'START_SHOOTING':
    return {
      ...state, shooting: true
    }
    case 'STOP_SHOOTING':
    return {
      ...state, shooting: false
    }
    case 'START_ANIMATING':
    return {
      ...state, isAnimating: true
    }
    case 'STOP_ANIMATING':
    return {
      ...state, isAnimating: false
    }
    case 'START_MOVING':
    return {
      ...state, isMoving: true
    }
    case 'STOP_MOVING':
    return {
      ...state, isMoving: false
    }

    case 'IDLE':
      return {
        ...state, animation: 'idle'
    }
    case 'WALKING':
      return {
        ...state, animation: 'walking'
    }
    case 'RUNNING':
      return {
        ...state, animation: 'running'
    }
    case 'JUMPING':
      return {
        ...state, animation: 'jumping'
    }
    case 'SLEEPING':
      return {
        ...state, animation: 'sleeping'
    }

    default:
      return state
  }
}

export default unitReducer
