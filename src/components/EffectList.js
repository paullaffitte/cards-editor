import React, { Component } from 'react';
import ActionsTypes from '../constants/ActionsTypes';
import ItemList from './ItemList';

class EffectList extends Component {

  render() {
    return (
      <ItemList
        type={ ActionsTypes.Item.EFFECT }
        preprocess={ this.props.preprocess }
        renderItem={ item => (
          <div>{ item.description
            ? <span>{ item.description }</span>
            : <span style={{ color: 'grey', fontStyle: 'oblique' }}>empty</span> }</div>
        ) }
        onSelect={ this.props.onSelect }
        onEdit={this.props.onEdit}
      />
    );
  }
}

export default EffectList
