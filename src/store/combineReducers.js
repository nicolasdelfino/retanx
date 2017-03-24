import { combineReducers } from 'redux'
import app from './reducers/appReducer'
import unitReducer from './reducers/unitReducer'

const rootReducer = combineReducers({
  app,
  unitReducer
})

export default rootReducer
