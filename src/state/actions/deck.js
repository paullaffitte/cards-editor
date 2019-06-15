import { message } from 'antd';
import ActionsTypes from '../../constants/ActionsTypes';
import Wrapper from '../../services/Wrapper';
import { getItems, getEditedItem, getCurrentDeck, getCards, getCardsByIds } from '../selectors/deck';
import i18n from '../../constants/i18n';

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

const reorderItem = (type, source, destination) => {
  return {
    type: ActionsTypes.REORDER_ITEM,
    payload: { type, source, destination },
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
  reorderItem,

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

  setResource: resource => {
    return {
      type: ActionsTypes.SET_RESOURCE,
      payload: resource
    }
  },
  setResourceMeta: resourceMeta => {
    return {
      type: ActionsTypes.SET_RESOURCE_META,
      payload: resourceMeta
    }
  },
  deleteResource: name => {
    return {
      type: ActionsTypes.DELETE_RESOURCE,
      payload: name
    }
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

function itemInUse(state, type, id) {
  switch (type) {
    case ActionsTypes.Item.CARD:
      const cards = getCards(state);

      const childsNames = cards.map(card => {
        const models = getCardsByIds(state, card.models ? card.models : []);
        const modelsIds = models.map(({ id }) => id);

        return modelsIds.includes(id) ? card.name : null;
      }).filter(Boolean);

      if (childsNames.length)
        return i18n.t('messages.cannotDeleteModelCard', { childNames: childsNames.join(', ') });

      break;
    case ActionsTypes.Item.EFFECT:
      break;
    default:
      break;
  }
}

const deleteItem = (type, id) => {
  return (dispatch, getState) => {
    const state = getState();
    const error = itemInUse(state, type, id);

    if (error) {
      message.error(error);
      return;
    }

    if (getEditedItem(type, state).id === id)
      dispatch(selectFirstItem(type, getItems(type, state)));

    dispatch({ type: ActionsTypes.DELETE_ITEM, payload: { type, id } });
  };
};

const nowSec = () => Date.now() / 1000
const updateCardSizeLimitRate = 2;
let lastCardSizeUpdate = nowSec() - updateCardSizeLimitRate;
let cardSizeWillUpdate = false;

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

  updateCardSize: () => {
    return (dispatch, getState) => {
      const updateCardSize = () => {
        lastCardSizeUpdate = nowSec();
        cardSizeWillUpdate = false;
        dispatch({ type: ActionsTypes.UPDATE_CARD_SIZE, payload: null });
      }
      const deltaTime = nowSec() - lastCardSizeUpdate;

      if ( deltaTime < updateCardSizeLimitRate) {
        if (!cardSizeWillUpdate) {
          const delay = updateCardSizeLimitRate - deltaTime;
          cardSizeWillUpdate = true;
          setTimeout(updateCardSize, delay * 1000);
        }
        return;
      }
      updateCardSize();
    };
  },

  writeDeck: filename => {
    const cleanList = ({original, updated, ...item}) => item;

    const cleanResources = resources => {
      const cleanResources = {};
      for (let id in resources) {
        const { path } = resources[id];
        cleanResources[id] = path;
      }
      return cleanResources;
    };

    const cleanDeck = ({openAt, updated, cards, effects, resources, ...data}) => ({
      ...data,
      cards: cards.map(cleanList),
      effects: effects.map(cleanList),
      resources: cleanResources(resources)
    });

    return async (dispatch, getState) => {
      const getDeck = () => getCurrentDeck(getState());
      const dispatchSetRessource = resource => dispatch(actions.setResource(resource));
      const updates = await Wrapper.writeResources(filename, getDeck().resources);

      await Promise.all(updates.map(dispatchSetRessource));
      Wrapper.writeDeck(filename, cleanDeck(getDeck()));
    };
  },
};

export default {
  ...actions,
  ...thunkActions
};
