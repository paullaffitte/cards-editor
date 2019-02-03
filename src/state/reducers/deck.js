import ActionsTypes from '../../constants/ActionsTypes';

function deckUpdate(data) {
  return {deck: data};
}

const deck = {
  [ActionsTypes.UPDATE_CARD]: (state, updatedCard) => deckUpdate({
    current: state.deck.map(card => (card.id != updatedCard.id) ? card : updatedCard),
    editedCard: updatedCard
  }),
  [ActionsTypes.OPEN_DECK]: (state, deck) => {
    deck = deck.map(card => ({...card, id: ++state.lastCardId}));
    if (deck.length)
      return deckUpdate({
        current: deck,
        editedCard: deck[0]
      });
    return deckUpdate({current: deck});
  }
};

export default deck;
