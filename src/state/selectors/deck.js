import { createSelector } from 'reselect'
import initialState from '../initialState';

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

export const getCards = createSelector(
  [ getCurrentDeck ],
  deck => deck.cards
);

export const getEditedCard = state => {
  return state.deck ? state.deck.editedCard : getEditedCard(initialState);
};

export const getCardById = createSelector(
  [ getCards, getProps ],
  (cards, id) => cards.find(card => card.id == id)
);
