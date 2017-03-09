import { combineReducers } from 'redux'
import app from './reducers/appReducer'
import tank from './reducers/tankReducer'

const rootReducer = combineReducers({
  app,
  tank
})

export default rootReducer
