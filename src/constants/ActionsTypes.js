import keyMirror from 'key-mirror';

const ActionsTypes = keyMirror({
    UPDATE_CARD: null,
    OPEN_DECK: null,
    ADD_RESOURCE: null,
    REMOVE_RESOURCE: null
});

export default ActionsTypes;
