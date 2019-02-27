import ActionsTypes from '../../constants/ActionsTypes';

const deck = {
  selectCard: card => {
    return {
      type: ActionsTypes.SELECT_CARD,
      payload: card,
    };
  },
  updateCard: card => {
    return {
      type: ActionsTypes.UPDATE_CARD,
      payload: card,
    };
  },
  openDeck: deck => {
    return {
      type: ActionsTypes.OPEN_DECK,
      payload: deck,
    };
  },
  addResource: resource => {
    return {
      type: ActionsTypes.ADD_RESOURCE,
      payload: resource
    }
  },
  removeResource: name => {
    return {
      type: ActionsTypes.REMOVE_RESOURCE,
      payload: name
    }
  }
};

export default deck;
