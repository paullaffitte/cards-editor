import update from 'immutability-helper';
import ActionsTypes from '../../constants/ActionsTypes';
import { getEditedCard, getItemById } from '../selectors/deck';
import initialState from '../initialState';
import uuid from 'uuid/v1';

function deckUpdate(state, data) {
  return update(state, {deck: data});
}

const deck = {
  [ActionsTypes.SELECT_ITEM]: (state, { type, id }) => {
    type = ActionsTypes.Item[type].toLowerCase();
    const item        = getItemById(state, { type, id });
    const backupItem  = items => items.map(c => (c.id !== id) ? c : selectedItem);
    const selectedItem = { ...item, original: item };
    const updates     = { edited: {$set: {[type]: selectedItem}} };

    if (!('original' in item))
      updates.current = { [`${type}s`]: {$apply: backupItem} };

    return deckUpdate(state, updates);
  },
  [ActionsTypes.UPDATE_CARD]: (state, updatedCard) => {
    const editedCard  = getEditedCard(state);
    const updateCard  = cards => cards.map(card => (card.id !== updatedCard.id) ? card : updatedCard);

    if (updatedCard.id !== editedCard.id) {
      alert("An unexpected error occured: updated card id is different than edited card id.");
      return state;
    }

    updatedCard = update(editedCard, {$merge: updatedCard});
    updatedCard.updated = true;
    return deckUpdate(state, {
      current: {cards: {$apply: updateCard}},
      editedCard: {$set: updatedCard}
    });
  },
  [ActionsTypes.STAGE_CARDS]: state => {
    const stageCards = cards => cards.map(card => {
      const {updated, original, ...stagedCard} = card;
      return stagedCard;
    });
    return deckUpdate(state, {
      current: {cards: {$apply: stageCards}}
    });
  },
  [ActionsTypes.ADD_CARD]: state => {
    const newCard = { id: uuid() };
    return deckUpdate(state, {
      current: { cards: {$push: [newCard]} }
    });
  },
  [ActionsTypes.DELETE_CARD]: (state, cardId) => {
    const deleteCard = cards => cards.filter(card => card.id !== cardId);
    return deckUpdate(state, {
      current: { cards: {$apply: deleteCard} }
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
