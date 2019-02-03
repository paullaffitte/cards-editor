import ActionsTypes from '../../constants/ActionsTypes';

const deck = {
  updateCard: (card) => {
    return {
      type: ActionsTypes.UPDATE_CARD,
      payload: card,
    };
  },
  openDeck: (deck) => {
    return {
      type: ActionsTypes.OPEN_DECK,
      payload: deck,
    };
  }
};



export default deck;
