import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter';

//db.events.on('data', (dbname, event) => ... ) then store.dispatch(RECEIVED_COUNTER)?
const orbitSync = db => store => next => action => {
  switch (action.type) {
    case INCREMENT_COUNTER:
      console.log("Orbit sync:", action)
      db.inc(1).then(s => {
        console.log(s);
        console.log("counter:", db.value)
      });
      next(action);
      break;
    case DECREMENT_COUNTER:
      console.log("Orbit sync:", action)
      db.inc(-1).then(s => console.log(s));
      next(action);
      break;
    default:
      next(action);
  }
}

export default orbitSync;
