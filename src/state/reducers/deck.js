import update from 'immutability-helper';
import ActionsTypes from '../../constants/ActionsTypes';
import { getEditedItem, getItemById } from '../selectors/deck';
import initialState from '../initialState';
import uuid from 'uuid/v1';

function deckUpdate(state, data) {
  return update(state, {deck: data});
}

const getItemKey = (type, list) => type.toLowerCase() + (list ? 's' : '');

const deck = {
  [ActionsTypes.SELECT_ITEM]: (state, { type, id }) => {
    type = ActionsTypes.safeItem(type);
    const item        = getItemById(state, { type, id });
    const backupItem  = items => items.map(i => (i.id !== id) ? i : selectedItem);
    const selectedItem = { ...item, original: item };
    const updates     = { edited: {$set: {[getItemKey(type)]: selectedItem}} };

    if (!('original' in item))
      updates.current = { [getItemKey(type, true)]: {$apply: backupItem} };

    return deckUpdate(state, updates);
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
      current: {[getItemKey(type, true)]: {$apply: updateItem}},
      editedItem: {$set: item}
    });
  },
  [ActionsTypes.STAGE_ITEMS]: (state, type) => {
    type = ActionsTypes.safeItem(type);
    const stageCards = cards => cards.map(card => {
      const {updated, original, ...stagedCard} = card;
      return stagedCard;
    });
    return deckUpdate(state, {
      current: {[getItemKey(type, true)]: {$apply: stageCards}}
    });
  },
  [ActionsTypes.ADD_ITEM]: (state, type) => {
    const newItem = { id: uuid() };
    return deckUpdate(state, {
      current: { [getItemKey(type, true)]: {$push: [newItem]} }
    });
  },
  [ActionsTypes.DELETE_ITEM]: (state, {type, id}) => {
    const deleteItem = items => items.filter(item => item.id !== id);
    return deckUpdate(state, {
      current: { [getItemKey(type, true)]: {$apply: deleteItem} }
    });
  },

  [ActionsTypes.NEW_DECK]: (state, deck) => initialState,
  [ActionsTypes.OPEN_DECK]: (state, deck) => {
    return deckUpdate(initialState, { current: { $set: deck } });
  },
  [ActionsTypes.UPDATE_FILENAME]: (state, filename) => {
    return deckUpdate(state, { current: {filename: {$set: filename}} });
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
