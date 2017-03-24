const initState = {
  aimTarget: {x: 0, y: 0},
  detailsView: false,
  currentSelectionID: 0,
  debugMode: false,
  aimMode: false
}

//put aim target here and change aimTarget within a tank reducer to point to target?
const app = (state = initState, action) => {
  switch (action.type) {
    case 'SELECT_UNIT':
    return {
      ...state,
      currentSelectionID: action.payload.id
    }
    case 'SHOW_DETAIL_VIEW':
      return {
        ...state,
        detailsView: true
    }
    case 'HIDE_DETAIL_VIEW':
      return {
        ...state,
        detailsView: false
    }
    case 'TOGGLE_DEBUG':
      return {
        ...state,
        debugMode: !state.debugMode
    }
    case 'TOGGLE_AIM':
      return {
        ...state,
        aimMode: !state.aimMode
    }
    default:
      return state
  }
}

export default app
