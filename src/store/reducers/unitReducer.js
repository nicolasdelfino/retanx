const initState = {
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
        { ...specs, aimTarget: { x:action.payload.target.y, y: action.payload.target.x }, rotate: 'true', angle: action.payload.angle },
        ...state.units.slice(action.payload.id + 1),
      ],
    }
    case 'MOVE':
    specs = state.units[action.payload.id]
    return {
      ...state,
      units: [
        ...state.units.slice(0, action.payload.id),
        { ...specs, position: { x:action.payload.target.y, y: action.payload.target.x }, rotate: 'false' },
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
    default:
      return state
  }
}

export default unitReducer
