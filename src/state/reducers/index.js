import deck from './deck';
import initialState from '../initialState';

const reducersMap = {
  ...deck,
  leaveStateUnchanged: state => state,
};

const unknownAction = type => {
  console.error(`Unknown action ${type}`);
  return reducersMap.leaveStateUnchanged;
}

const reducers = function reducers(state = initialState, action) {
  if (window.isDev)
    console.log(action);

  const reducer = reducersMap[action.type] || unknownAction(action.type);
  const newState = reducer(state, action.payload, action.meta);
  return newState;
};

export default reducers;

