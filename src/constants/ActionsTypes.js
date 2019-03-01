import keyMirror from 'key-mirror';

const ActionsTypes = keyMirror({
    SELECT_CARD: null,
    UPDATE_CARD: null,
    STAGE_CARDS: null,
    ADD_CARD: null,
    DELETE_CARD: null,

    NEW_DECK: null,
    OPEN_DECK: null,
    UPDATE_FILENAME: null,

    ADD_RESOURCE: null,
    REMOVE_RESOURCE: null
});

export default ActionsTypes;
