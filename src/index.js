import React from 'react';
import Retanx from './Retanx';
import './css/index.css';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './store/combineReducers'
import createLogger from 'redux-logger';

const logger = createLogger();
const store = createStore(
  rootReducer,
  applyMiddleware(logger)
);

render(
  <Provider store={store}>
    <Retanx />
  </Provider>,
  document.getElementById('root')
)
