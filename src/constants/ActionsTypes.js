import keyMirror from 'key-mirror';

const ActionsTypes = {
  ...keyMirror({
    SELECT_ITEM: null,
    UPDATE_ITEM: null,
    STAGE_ITEMS: null,
    ADD_ITEM: null,
    DELETE_ITEM: null,

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

ActionsTypes.safeItem = type => {
  const safeType = ActionsTypes.Item[type];
  if (!safeType || !safeType.length)
    throw new Error(`Unknown item type "${safeType}"`);
  return safeType;
}

export default ActionsTypes;
