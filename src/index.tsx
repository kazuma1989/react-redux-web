import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { reducer } from './reducer'
import { GlobalStyle } from './GlobalStyle'
import { App } from './App'

const store = createStore(
  reducer,
  undefined,
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION__?.()
    : undefined,
)

ReactDOM.render(
  <Provider store={store}>
    <GlobalStyle />
    <App />
  </Provider>,
  document.getElementById('app'),
)
