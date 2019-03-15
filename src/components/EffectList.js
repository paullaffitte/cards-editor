import ActionsTypes from '../constants/ActionsTypes';
import List from './List';

export default List({
  type: ActionsTypes.Item.EFFECT,
  preprocess: (state, items) => items
});
