import React from 'react';
import ActionsTypes from '../constants/ActionsTypes';
import List from './List';

export default List({
  type: ActionsTypes.Item.EFFECT,
  preprocess: (state, items) => items,
  renderItem: item => (
    <span>effect {item.id}</span>
  )
});
