import { createSelector } from 'reselect'
import initialState from '../initialState';
import ActionTypes from '../../constants/ActionsTypes';

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

export const getItems = createSelector(
  [ getCurrentDeck, getProps ],
  (deck, { type }) => deck.cards
);

export const getEditedItem = (type, state) => {
  return state.deck ? state.deck.edited[type.toLowerCase()] : getEditedItem(type, initialState);
};

export const getItemById = createSelector(
  [ getItems, getProps ],
  (items, { type, id }) => {
    return items.find(item => item.id === id)
  }
);

export const getCards = state => getItems(state, ActionTypes.Item.CARD);
export const getEditedCard = state => getEditedItem(ActionTypes.Item.CARD, state);
