// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import getCounterStore from './ipfs/db';
import './app.global.css';


getCounterStore().then(db => {
  // Received an update event (usually from other peers)
  db.events.on('data', (dbname, event) => {
    console.log(">", dbname, event, db.value)
    // TODO: update the store with 'db.value'
  });

  // Wait for database to load its history
  console.log('db value', db.value);
  const store = configureStore(db, { counter: db.value || 0 });
  const history = syncHistoryWithStore(hashHistory, store);

  render(
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>,
    document.getElementById('root')
  );
});
