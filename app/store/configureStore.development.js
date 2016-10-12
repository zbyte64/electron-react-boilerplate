import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import { routerMiddleware, push } from 'react-router-redux';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';
import orbitSync from '../ipfs/middleware';

import * as counterActions from '../actions/counter';

const actionCreators = {
  ...counterActions,
  push,
};

const logger = createLogger({
  level: 'info',
  collapsed: true
});

const router = routerMiddleware(hashHistory);


export default function configureStore(db, initialState: Object) {
  const enhancer = compose(
    applyMiddleware(thunk, router, orbitSync(db), logger),
    window.devToolsExtension ?
      window.devToolsExtension({ actionCreators }) :
      noop => noop
  );


  const store = createStore(rootReducer, initialState, enhancer);

  if (window.devToolsExtension) {
    window.devToolsExtension.updateStore(store);
  }

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  return store;
}
