import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {compose, createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from "./redux/reducer"
import {applyMiddleware} from 'redux'
import reduxThunk from 'redux-thunk'

const composeEnhancers =
   typeof window === 'object' &&
   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
         // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      }) : compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(reduxThunk)))

const app = (
   <Provider store={store}>
      <App/>
   </Provider>
)



ReactDOM.render(app, document.getElementById('root'));

serviceWorker.unregister();
