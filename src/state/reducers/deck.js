import update from 'immutability-helper';
import ActionsTypes from '../../constants/ActionsTypes';
import { getEditedCard, getCardById } from '../selectors/deck';
import initialState from '../initialState';
import uuid from 'uuid/v1';

function deckUpdate(state, data) {
  return update(state, {deck: data});
}

function updateCard(cards, id, updateCard) {
  return cards.map(c => (c.id !== id) ? c : updateCard(c));
}

const deck = {
  [ActionsTypes.SELECT_CARD]: (state, cardId) => {
    const card        = getCardById(state, cardId);
    const backupCard  = cards => cards.map(c => (c.id !== cardId) ? c : selectedCard);
    const selectedCard = { ...card, original: card };
    const updates     = { editedCard: {$set: selectedCard} };

    if (!('original' in card))
      updates.current = { cards: {$apply: backupCard} };

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

  [ActionsTypes.OPEN_DECK]: (state, deck) => {
    deck.lastCardId = initialState.deck.lastCardId;
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
