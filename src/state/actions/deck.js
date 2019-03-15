import ActionsTypes from '../../constants/ActionsTypes';
import { getCards, getEditedItem } from '../selectors/deck';
import keyMirror from 'key-mirror';

const selectItem = (type, id) => {
  return {
    type: ActionsTypes.SELECT_ITEM,
    payload: { type, id }
  };
};

const updateItem = (type, item) => {
  return {
    type: ActionsTypes.UPDATE_ITEM,
    payload: { type, item }
  };
};

const stageItems = (type) => {
  return {
    type: ActionsTypes.STAGE_ITEMS,
    payload: type,
  };
};

const actions = {
  selectCard: cardId => selectItem(ActionsTypes.Item.CARD, cardId),
  updateCard: card => updateItem(ActionsTypes.Item.CARD, card),
  stageCards: () => stageItems(ActionsTypes.Item.CARD),

  newDeck: () => {
    return {
      type: ActionsTypes.NEW_DECK,
      payload: null,
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

const selectFirstCard = (cards) => actions.selectCard(cards[0].id);

const thunkActions = {
  addCard: () => {
    return (dispatch, getState) => {
      dispatch({ type: ActionsTypes.ADD_CARD, payload: null });
      const cards = getCards(getState());
      if (cards.length)
        dispatch(actions.selectCard(cards[cards.length - 1].id));
    };
  },
  deleteCard: cardId => {
    return (dispatch, getState) => {
      const state = getState();
      if (getEditedItem(state, 'CARD').id === cardId)
        dispatch(selectFirstCard(getCards(state)));

      dispatch({ type: ActionsTypes.DELETE_CARD, payload: cardId });
    };
  },

  openDeck: deck => {
    return (dispatch, getState) => {
      dispatch({ type: ActionsTypes.OPEN_DECK, payload: deck });
      const cards = getCards(getState());
      if (cards.length)
        dispatch(selectFirstCard(cards));
    };
  },
};

export default {
  ...actions,
  ...thunkActions
};
