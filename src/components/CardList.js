import React from 'react';
import { getEditedItem, getResourceByName } from '../state/selectors/deck';
import ActionsTypes from '../constants/ActionsTypes';
import List from './List';

export default List({
  type: ActionsTypes.Item.CARD,
  preprocess: (state, items) => items.map(item => ({
    ...item,
    thumbnail: getResourceByName(state, item.thumbnail),
    className: item.id === getEditedItem(ActionsTypes.Item.CARD, state).id ? 'selected' : ''
  })),
  renderItem: item => (
    <div>
      <h2>{item.name}</h2>
      <span>{item.description}</span>
    </div>
  )
});

