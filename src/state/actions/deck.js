import ActionsTypes from '../../constants/ActionsTypes';
import { getItems, getEditedItem } from '../selectors/deck';

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

const selectFirstItem = (type, items) => selectItem(type, items[0].id);

const addItem = type => {
  return (dispatch, getState) => {
    dispatch({ type: ActionsTypes.ADD_ITEM, payload: type });

    const items = getItems(getState(), type);
    if (items.length)
      dispatch(selectItem(type, items[items.length - 1].id));
  };
};

const deleteItem = (type, id) => {
  return (dispatch, getState) => {
    const state = getState();
    if (getEditedItem(type, state).id === id)
      dispatch(selectFirstItem(type, getItems(state, type)));

    dispatch({ type: ActionsTypes.DELETE_ITEM, payload: { type, id } });
  };
};

const thunkActions = {
  addCard:    () => addItem(ActionsTypes.Item.CARD),
  deleteCard: id => deleteItem(ActionsTypes.Item.CARD, id),

  openDeck: deck => {
    return (dispatch, getState) => {
      dispatch({ type: ActionsTypes.OPEN_DECK, payload: deck });
      const cards = getItems(getState(), ActionsTypes.Item.CARD);
      if (cards.length)
        dispatch(selectFirstItem(ActionsTypes.Item.CARD, cards));
    };
  },
};

export default {
  ...actions,
  ...thunkActions
};
