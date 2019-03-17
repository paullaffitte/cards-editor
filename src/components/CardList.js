import React from 'react';
import { getResourceByName } from '../state/selectors/deck';
import ActionsTypes from '../constants/ActionsTypes';
import List from './List';

export default List({
  type: ActionsTypes.Item.CARD,
  preprocess: (state, items) => items.map(item => ({
    ...item,
    thumbnail: getResourceByName(state, item.thumbnail)
  })),
  renderItem: item => (
    <div>
      <h2>{item.name}</h2>
      <span>{item.description}</span>
    </div>
  )
});

