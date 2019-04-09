import update from 'immutability-helper';
import ActionsTypes from '../../constants/ActionsTypes';
import { getEditedItem, getItemById, getCards, getResourceById } from '../selectors/deck';
import initialState from '../initialState';
import uuid from 'uuid/v1';

function deckUpdate(state, data, freshDeck, setUpdated=true) {
  const newState = update(state, { deck: data });

  return (setUpdated === true)
    ? update(newState, { deck: {current: {updated: {$set: !freshDeck}}} })
    : newState;
}

const sanitizeCard = card => ({ effects: [], ...card });
const sanitizeItem = (type, item) => {
  const sanitizers = {
    [ActionsTypes.Item.CARD]: sanitizeCard,
  };
  return Object.keys(sanitizers).includes(type)
    ? sanitizers[type](item)
    : item;
}

const getItemKey = ActionsTypes.getItemKey;

const deck = {
  [ActionsTypes.SELECT_ITEM]: (state, { type, id }) => {
    type = ActionsTypes.safeItem(type);
    const item        = getItemById(state, { type, id });
    const backupItem  = items => items.map(i => (i.id !== id) ? i : selectedItem);
    const selectedItem = { ...item, original: item };
    const updates     = { edited: {[getItemKey(type)]: {$set: selectedItem}} };

    if (!('original' in item))
      updates.current = { [getItemKey(type, true)]: {$apply: backupItem} };

    return deckUpdate(state, updates, false, false);
  },
  [ActionsTypes.UPDATE_ITEM]: (state, { type, item }) => {
    type = ActionsTypes.safeItem(type);
    const editedItem  = getEditedItem(type, state);
    const updateItem  = items => items.map(i => (i.id !== item.id) ? i : item);

    if (item.id !== editedItem.id) {
      alert("An unexpected error occured: updated item id is different than edited item id.");
      return state;
    }

    item = update(editedItem, {$merge: item});
    item.updated = true;
    return deckUpdate(state, {
      current: { [getItemKey(type, true)]: {$apply: updateItem} },
      edited: { [getItemKey(type)]: {$set: item} }
    });
  },
  [ActionsTypes.STAGE_ITEMS]: (state, type) => {
    type = ActionsTypes.safeItem(type);
    const stageCards = cards => cards.map(card => {
      const {updated, original, ...stagedCard} = card;
      return stagedCard;
    });
    return deckUpdate(state, {
      current: { [getItemKey(type, true)]: {$apply: stageCards} }
    }, true);
  },
  [ActionsTypes.ADD_ITEM]: (state, { type, item }) => {
    const newItem = { ...item, id: uuid() };
    return deckUpdate(state, {
      current: { [getItemKey(type, true)]: {$push: [sanitizeItem(type, newItem)]} }
    });
  },
  [ActionsTypes.DELETE_ITEM]: (state, {type, id}) => {
    const deleteItem = items => items.filter(item => item.id !== id);
    return deckUpdate(state, {
      current: { [getItemKey(type, true)]: {$apply: deleteItem} }
    });
  },

  [ActionsTypes.NEW_DECK]: (state, deck) => deckUpdate(state, { $set: initialState.deck }, true),
  [ActionsTypes.OPEN_DECK]: (state, deck) => {
    const sanitizeCards = cards => cards.map(sanitizeCard);
    state = deckUpdate(state, { $set: {...initialState.deck, current: {...initialState.deck.current, ...deck}} });
    return deckUpdate(state, {
      current: { [getItemKey(ActionsTypes.Item.CARD, true)]: {$apply: sanitizeCards} }
    }, true);
  },
  [ActionsTypes.UPDATE_FILENAME]: (state, filename) => {
    return deckUpdate(state, { current: {filename: {$set: filename}} });
  },

  [ActionsTypes.SET_RESOURCE]: (state, resource) => {
    const id = resource.id ? resource.id : uuid();
    return deckUpdate(state, {
      current: { resources: {[id]: {$set: {...resource, id}}} }
    });
  },
  [ActionsTypes.SET_RESOURCE_META]: (state, resource) => {
    const id = resource.id ? resource.id : uuid();
    let { src, path, ...resourceMeta } = resource;
    return deckUpdate(state, {
      current: { resources: {[id]: {$merge: {...resourceMeta, id}}} }
    }, false, false);
  },
  [ActionsTypes.DELETE_RESOURCE]: (state, id) => {
    const deleteResource = ({[id]: resource, ...resources}) => resources;
    return deckUpdate(state, {
      current: { resources: {$apply: deleteResource} }
    });
  },

  [ActionsTypes.UPDATE_CARDS_CONFIG]: (state, cardsConfig) => {
    return deckUpdate(state, {
      current: { cardsConfig: {$merge: cardsConfig} }
    });
  },
  [ActionsTypes.UPDATE_EXPORT_CONFIG]: (state, exportConfig) => {
    return deckUpdate(state, {
      current: { exportConfig: {$merge: exportConfig} }
    });
  },
  [ActionsTypes.UPDATE_AVAILABLE_FONTS]: (state, fonts) => {
    return update(state, {
      availableFonts: { $set: fonts }
    });
  },
  [ActionsTypes.UPDATE_CARD_SIZE]: (state) => {
    const groupAndCount = backgrounds => Object.values(backgrounds.reduce((acc, id) => {
      if (!acc.hasOwnProperty(id)) {
        acc[id] = { id, count: 0 };
      }
      acc[id].count++;
      return acc;
    }, {}));

    const backgroundIds = getCards(state).map(card => card.background);
    const backgrounds = groupAndCount(backgroundIds)
      .map(({ id, count }) => ({ resource: getResourceById(state, id), count: count }))
      .filter(({ resource: {width, height} }) => width && height)
      .sort((bl, br) => br.count - bl.count);

    const multipleSizes = backgrounds.length > 1;
    const background = backgrounds.shift();
    if (!background)
      return state;

    const { width, height } = background.resource;
    if (!width || !height)
      return state;

    return deckUpdate(state, {
      cardSize: { $set: {width: width, height: height, multipleSizes} }
    }, false, false);
  },
};

export default deck;
