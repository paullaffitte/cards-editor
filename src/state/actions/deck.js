import ActionsTypes from '../../constants/ActionsTypes';
import { getCards, getEditedCard } from '../selectors/deck';

const actions = {
  selectCard: cardId => {
    return {
      type: ActionsTypes.SELECT_CARD,
      payload: cardId,
    };
  },
  updateCard: card => {
    return {
      type: ActionsTypes.UPDATE_CARD,
      payload: card,
    };
  },
  stageCards: () => {
    return {
      type: ActionsTypes.STAGE_CARDS,
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
      if (getEditedCard(state).id == cardId)
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
