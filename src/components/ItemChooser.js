import React, {Component, Fragment } from 'react';
import { Select, message } from 'antd';
import DeckActions from '../state/actions/deck';
import ItemSelect from './ItemSelect';
import Item from './Item';

const { Option } = Select;

class ItemChooser extends Component {

  state = {
    value: []
  }

  static getDerivedStateFromProps(nextProps) {
    return 'value' in nextProps ? {
      value: nextProps.value ? nextProps.value : [],
    } : [];
  }

  change = async value => {
    if (this.props.onChange) {
      this.props.onChange(value);
    } else {
      await this.setState({ value });
    }
  }

  onAdd = id => {
    if (this.state.value.findIndex(itemId => itemId === id) == -1) {
      this.change([ ...this.state.value, id ]);
    } else {
      message.warning('Model already added');
    }
  };

  onChange = (id, update) => {
    const itemIndex = this.state.value.findIndex(itemId => itemId === id);
    const value = [ ...this.state.value ];

    if (itemIndex == -1) {
      throw new Error('Item not found');
    }

    value[itemIndex] = update;
    this.change(value);
  }

  onDelete = async id => {
    const itemIndex = this.state.value.findIndex(itemId => itemId === id);
    const value = [ ...this.state.value ];

    value.pop(itemIndex);
    this.change(value);
  }

  renderItem = id => {
    return (
      <Item
        key={ id }
        style={{ height: '2.8em' }}
        onEdit={ this.props.onEdit }
        onDelete={ this.onDelete }
        confirmDelete="Are you sure to remove this model from this card?"
      >
        <ItemSelect
          type={ this.props.type }
          value={ id }
          onChange={ update => this.onChange(id, update) }
          id={ id }
        />
      </Item>
    );
  };

  render() {
    return (
      <Fragment>
        <ItemSelect
          type={ this.props.type }
          value={ 'Add a model' }
          onChange={ this.onAdd }
          key={ 'new' }
        />
        { this.state.value ? this.state.value.map(this.renderItem) : null }
      </Fragment>
    );
  }
}

export default ItemChooser;
