import deck from './deck';
import initialState from '../initialState';

const reducersMap = {
  ...deck,
  leaveStateUnchanged: state => state,
};

const reducers = function reducers(state = initialState, action) {
  console.log('action', action);
  const reducer = reducersMap[action.type] || reducersMap.leaveStateUnchanged;
  const newState = reducer(state, action.payload, action.meta);
  return newState;
};

export default reducers;

