import { createSelector } from 'reselect'

export const getCurrentDeck = state => {
  return state.deck ? state.deck.current : {};
};

export const getResources = createSelector(
  [ getCurrentDeck ],
  deck => deck ? deck.resources : {}
);
