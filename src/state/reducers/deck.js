import update from 'immutability-helper';
import ActionsTypes from '../../constants/ActionsTypes';
import { getEditedCard, getCardById } from '../selectors/deck';

function deckUpdate(state, data) {
  return update(state, {deck: data});
}

function updateCard(cards, id, updateCard) {
  return cards.map(c => (c.id !== id) ? c : updateCard(c));
}

const deck = {
  [ActionsTypes.SELECT_CARD]: (state, cardId) => {
    const card        = getCardById(state, cardId);
    const backupCard  = cards => cards.map(c => (c.id !== cardId) ? c : { ...card, original: card });
    const updates     = { editedCard: {$set: card} };

    if (!('original' in card))
      updates.current = {cards: {$apply: backupCard}};

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
    return deckUpdate(state, {
      current: {cards: {$apply: updateCard}},
      editedCard: {$set: updatedCard}
    })
  },
  [ActionsTypes.STAGE_CARDS]: state => {
    const stageCards = cards => cards.map(card => card.original ? card.original : card);
    return deckUpdate(state, {
      current: {cards: {$apply: stageCards}}
    })
  },

  [ActionsTypes.OPEN_DECK]: (state, deck) => {
    deck.cards = deck.cards.map(card => ({...card, id: ++state.deck.lastCardId}));
    return deckUpdate(state, { current: {$set: deck} });
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
