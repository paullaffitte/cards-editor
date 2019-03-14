import keyMirror from 'key-mirror';

const ActionsTypes = {
  ...keyMirror({
    SELECT_ITEM: null,
    UPDATE_CARD: null,
    STAGE_CARDS: null,
    ADD_CARD: null,
    DELETE_CARD: null,

    NEW_DECK: null,
    OPEN_DECK: null,
    UPDATE_FILENAME: null,

    ADD_RESOURCE: null,
    REMOVE_RESOURCE: null
  }),
  Item: keyMirror({
    CARD: null,
    EFFECT: null
  })
};

export default ActionsTypes;
