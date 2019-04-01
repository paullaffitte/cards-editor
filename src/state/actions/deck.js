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

const stageItems = type => {
  return {
    type: ActionsTypes.STAGE_ITEMS,
    payload: type,
  };
};

const actions = {
  selectItem,
  stageItems,

  updateCard: card => updateItem(ActionsTypes.Item.CARD, card),
  updateEffect: effect => updateItem(ActionsTypes.Item.EFFECT, effect),

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
  },

  updateCardsConfig: cardsConfig => {
    return {
      type: ActionsTypes.UPDATE_CARDS_CONFIG,
      payload: cardsConfig
    };
  },
  updateExportConfig: exportConfig => {
    return {
      type: ActionsTypes.UPDATE_EXPORT_CONFIG,
      payload: exportConfig
    };
  },

  updateAvailableFonts: fonts => {
    return {
      type: ActionsTypes.UPDATE_AVAILABLE_FONTS,
      payload: fonts
    };
  },
};

const selectFirstItem = (type, items) => selectItem(type, items[0].id);

const addItem = (type, item) => {
  return (dispatch, getState) => {
    dispatch({ type: ActionsTypes.ADD_ITEM, payload: { type, item } });

    const items = getItems(type, getState());
    if (items.length)
      dispatch(selectItem(type, items[items.length - 1].id));
  };
};

const deleteItem = (type, id) => {
  return (dispatch, getState) => {
    const state = getState();
    if (getEditedItem(type, state).id === id)
      dispatch(selectFirstItem(type, getItems(type, state)));

    dispatch({ type: ActionsTypes.DELETE_ITEM, payload: { type, id } });
  };
};

const thunkActions = {
  addItem,
  deleteItem,

  openDeck: deck => {
    return (dispatch, getState) => {
      dispatch({ type: ActionsTypes.OPEN_DECK, payload: deck });
      const cards = getItems(ActionsTypes.Item.CARD, getState());
      if (cards.length)
        dispatch(selectFirstItem(ActionsTypes.Item.CARD, cards));
    };
  },
};

export default {
  ...actions,
  ...thunkActions
};
