import React, { Component } from 'react';
import { getEditedItem, getResourceByName } from '../state/selectors/deck';
import ActionsTypes from '../constants/ActionsTypes';
import List from './List';

class CardList extends Component {
  render() {
    return (
      <List
        type={ ActionsTypes.Item.CARD }
        preprocess={ (item, state) => ({
          ...item,
          thumbnail: getResourceByName(state, item.thumbnail),
          className: item.id === getEditedItem(ActionsTypes.Item.CARD, state).id ? 'selected' : ''
        }) }
        renderItem={ item => (
          <div>
            <h2>{item.name}</h2>
            <span>{item.description}</span>
          </div>
        ) }
      />
    );
  }
}

export default CardList;
