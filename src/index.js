import reducer from './reducers/reducer.js'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import React from 'react';
import ReactDOM from 'react-dom';
import { ActionCableProvider } from 'react-actioncable-provider';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { API_WS_ROOT } from './constants/api-endpoints.js';


const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

console.log('index js store', store.getState())

ReactDOM.render(
  <Provider store={store}>
    <ActionCableProvider url={API_WS_ROOT}>
      <App />
    </ActionCableProvider>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
