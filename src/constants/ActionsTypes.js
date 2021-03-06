import keyMirror from 'key-mirror';

const ActionsTypes = {
  ...keyMirror({
    SELECT_ITEM: null,
    UPDATE_ITEM: null,
    REORDER_ITEM: null,
    STAGE_ITEMS: null,
    ADD_ITEM: null,
    DELETE_ITEM: null,

    NEW_DECK: null,
    OPEN_DECK: null,
    UPDATE_FILENAME: null,

    SET_RESOURCE: null,
    SET_RESOURCE_META: null,
    DELETE_RESOURCE: null,

    UPDATE_EXPORT_CONFIG: null,
    UPDATE_AVAILABLE_FONTS: null,
    UPDATE_CARD_SIZE: null
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

ActionsTypes.getItemKey = (safeType, list) => safeType.toLowerCase() + (list ? 's' : '');

export default ActionsTypes;
