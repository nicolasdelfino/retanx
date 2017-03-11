// width: 45,
// height: 65,

const initState = {
  units: []
}

// tank reducer contains tank array, each tank with a unique id
// const tanka = (state = initState, action) => {
//   switch (action.type) {
//     case 'AIM':
//       return {
//         ...state,
//         aimTarget: { x:action.payload.y, y: action.payload.x },
//         rotate: 'true'
//     }
//     case 'MOVE':
//       return {
//         ...state,
//         position: { x:action.payload.y, y: action.payload.x },
//         rotate: 'false'
//     }
//     case 'SELECT':
//       let current = state.selected
//       return {
//         ...state, selected: !current
//     }
//     default:
//       return state
//   }
// }

const tanks = (state = initState, action) => {
  let specs = null
  switch (action.type) {
    case 'ADD_TANK':
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
        { ...specs, aimTarget: { x:action.payload.target.y, y: action.payload.target.x }, rotate: 'true' },
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
    let tankSelectionState = !state.units[action.payload.id].selected
    specs = state.units[action.payload.id]
    return {
      ...state,
      units: [
        ...state.units.slice(0, action.payload.id),
        { ...specs, selected: tankSelectionState },
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

export default tanks
