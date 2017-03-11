import { combineReducers } from 'redux'
import app from './reducers/appReducer'
import tanks from './reducers/tankReducer'

const rootReducer = combineReducers({
  app,
  tanks
})

export default rootReducer
