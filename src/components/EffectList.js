import React, { Component } from 'react';
import ActionsTypes from '../constants/ActionsTypes';
import List from './List';
import { getEditedItem } from '../state/selectors/deck';

class EffectList extends Component {

  render() {
    return (
      <List
        type={ ActionsTypes.Item.EFFECT }
        preprocess={ this.props.preprocess }
        renderItem={ item => (
          <div> item {item.id}</div>
        ) }
        onSelect={ this.props.onSelect }
      />
    );
  }
}

export default EffectList
