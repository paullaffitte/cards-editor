import ActionsTypes from '../../constants/ActionsTypes';
import { getCards } from '../selectors/deck';

const actions = {
  selectCard: card => {
    return {
      type: ActionsTypes.SELECT_CARD,
      payload: card,
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

const thunkActions = {
  addCard: () => {
    return (dispatch, getState) => {
      dispatch({ type: ActionsTypes.ADD_CARD, payload: null });
      const cards = getCards(getState());
      if (cards.length)
        dispatch(actions.selectCard(cards[cards.length - 1].id));
    };
  },
  openDeck: deck => {
    return (dispatch, getState) => {
      dispatch({ type: ActionsTypes.OPEN_DECK, payload: deck });
      const cards = getCards(getState());
      if (cards.length)
        dispatch(actions.selectCard(cards[0].id));
    };
  },
};

export default {
  ...actions,
  ...thunkActions
};
