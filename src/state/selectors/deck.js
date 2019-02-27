import { createSelector } from 'reselect'

export const getProps = (state, props) => {
  return props;
};

export const getCurrentDeck = state => {
  return state.deck ? state.deck.current : {}; // FIXME replace all {} by values from initialState.js
};

export const getResources = createSelector(
  [ getCurrentDeck ],
  deck => deck ? deck.resources : {}
);

export const getResourceByName = createSelector(
  [ getResources, getProps ],
  (resources, name) => name in resources ? 'file://' + resources[name] : null
);

export const getCards = createSelector(
  [ getCurrentDeck ],
  deck => deck.cards
);

export const getEditedCard = state => {
  return state.deck ? state.deck.editedCard : {};
};

export const getCardById = createSelector(
  [ getCards, getProps ],
  (cards, id) => cards.find(card => card.id == id)
);
