import ActionsTypes from '../../constants/ActionsTypes';
import update from 'immutability-helper';

function deckUpdate(state, data) {
  return update(state, {deck: data});
}

const deck = {
  [ActionsTypes.SELECT_CARD]: (state, card) => {
    return deckUpdate(state, {
      editedCard: {$set: card}
    })
  },
  [ActionsTypes.UPDATE_CARD]: (state, updatedCard) => {
    const updateCards = cards => cards.map(card => (card.id !== updatedCard.id) ? card : updatedCard);
    return deckUpdate(state, {
      current: {cards: {$apply: updateCards}},
      editedCard: {$set: updatedCard}
    })
  },
  [ActionsTypes.OPEN_DECK]: (state, deck) => {
    deck.cards = deck.cards.map(card => ({...card, id: ++state.deck.lastCardId}));
    return deckUpdate(state, {
      current: {$set: deck},
      editedCard: {$set: deck.cards.length ? deck.cards[0] : null}
    });
  },
  [ActionsTypes.ADD_RESOURCE]: (state, {filename, path}) => {
    return deckUpdate(state, {
      current: {resources: {[filename]: {$set: path}}}
    });
  },
  [ActionsTypes.REMOVE_RESOURCE]: (state, name) => {
    const removeResource = ({[name]: path, ...resources}) => resources;
    return deckUpdate(state, {
      current: {resources: {$apply: removeResource}}
    });
  }
};

export default deck;
