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
  stageCards: cardId => {
    return {
      type: ActionsTypes.STAGE_CARDS,
      payload: null,
    };
  },

  openDeck: deck => {
    return {
      type: ActionsTypes.OPEN_DECK,
      payload: deck,
    };
  },
  updateFilename: filename => {
    return {
      type: ActionsTypes.UPDATE_FILENAME,
      payload: filename,
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
