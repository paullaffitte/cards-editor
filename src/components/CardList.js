import React, { Component } from 'react';
import { getEditedItem, getResourceById } from '../state/selectors/deck';
import ActionsTypes from '../constants/ActionsTypes';
import ItemList from './ItemList';

class CardList extends Component {
  render() {
    return (
      <ItemList
        type={ ActionsTypes.Item.CARD }
        preprocess={ (item, state) => (item.type && item.type !== this.props.cardsType ? null : {
          ...item,
          thumbnail: getResourceById(state, item.thumbnail).src,
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
