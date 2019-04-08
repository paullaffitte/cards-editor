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

const resourceBase = initialState.deck.cardSize;
export const getResourceById = createSelector(
  [ getResources, getProps ],
  (resources, id) => id in resources
    ? { ...resourceBase , ...resources[id] }
    : resourceBase
);

const _getItems = createSelector(
  [ getCurrentDeck, getProps ],
  (deck, { type }) => {
    return deck[ActionsTypes.getItemKey(type, true)];
  }
);

export const getItems = (type, state) => _getItems(state, { type });
export const getCards = state => getItems(ActionsTypes.Item.CARD, state);

export const getEditedItem = (type, state) => {
  return state.deck ? state.deck.edited[ActionsTypes.getItemKey(type)] : getEditedItem(type, initialState);
};

export const getItemById = createSelector(
  [ _getItems, getProps ],
  (items, { type, id }) => {
    return items.find(item => item.id === id)
  }
);

export const getItemsByIds = createSelector(
  [ _getItems, getProps ],
  (items, { type, ids }) => {
    return items.filter(item => ids.includes(item.id))
  }
);

export const getEditedCard = state => getEditedItem(ActionsTypes.Item.CARD, state);
export const getEditedEffect = state => getEditedItem(ActionsTypes.Item.EFFECT, state);

export const getEffectsByIds = (state, ids) => getItemsByIds(state, {type: ActionsTypes.Item.EFFECT, ids});

export const getCardsConfig = createSelector(
  [ getCurrentDeck ],
  deck => {
    return deck.cardsConfig;
  }
);

export const getExportConfig = createSelector(
  [ getCurrentDeck ],
  deck => deck.exportConfig
);
