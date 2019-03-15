import { createSelector } from 'reselect'
import initialState from '../initialState';
import ActionsTypes from '../../constants/ActionsTypes';

export const getProps = (state, props) => {
  return props;
};

export const getCurrentDeck = state => {
  return state.deck ? state.deck.current : getCurrentDeck(initialState);
};

export const getResources = createSelector(
  [ getCurrentDeck ],
  deck => deck ? deck.resources : getResources(initialState)
);

export const getResourceByName = createSelector(
  [ getResources, getProps ],
  (resources, name) => name in resources ? 'file://' + resources[name] : null
);

const _getItems = createSelector(
  [ getCurrentDeck, getProps ],
  (deck, { type }) => {
    return deck[ActionsTypes.getItemKey(type, true)];
  }
);

export const getItems = (type, state) => _getItems(state, { type });

export const getEditedItem = (type, state) => {
  return state.deck ? state.deck.edited[ActionsTypes.getItemKey(type)] : getEditedItem(type, initialState);
};

export const getItemById = createSelector(
  [ _getItems, getProps ],
  (items, { type, id }) => {
    return items.find(item => item.id === id)
  }
);

export const getEditedCard = state => getEditedItem(ActionsTypes.Item.CARD, state);
