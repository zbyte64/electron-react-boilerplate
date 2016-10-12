// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import orbitSync from '../ipfs/middleware';

const router = routerMiddleware(hashHistory);


export default function configureStore(db, initialState: Object) {
  const enhancer = applyMiddleware(thunk, router, orbitSync(db));

  return createStore(rootReducer, initialState, enhancer);
}
