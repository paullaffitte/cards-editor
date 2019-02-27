import { createSelector } from 'reselect'

export const getProps = (state, props) => {
  return props;
};

export const getCurrentDeck = state => {
  return state.deck ? state.deck.current : {};
};

export const getResources = createSelector(
  [ getCurrentDeck ],
  deck => deck ? deck.resources : {}
);

export const getResourceByName = createSelector(
  [ getResources, getProps ],
  (resources, name) => {
    return name in resources ? 'file://' + resources[name] : null;
  }
);

export const getCards = createSelector(
  [ getCurrentDeck ],
  deck => {
    return deck.cards;
  }
);

export const getEditedCard = state => {
  return state.deck ? state.deck.editedCard : null;
};
