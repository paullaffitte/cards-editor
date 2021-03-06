import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { message } from 'antd';
import { withTranslation } from "react-i18next";
import DeckActions from '../state/actions/deck';
import ItemSelect from './ItemSelect';
import Item from './Item';

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
    if (this.state.value.findIndex(itemId => itemId === id) === -1) {
      this.change([ ...this.state.value, id ]);
    } else {
      message.warning(this.props.t('itemChooser.messages.alreadyAdded'));
    }
  };

  onChange = (id, update) => {
    const itemIndex = this.state.value.findIndex(itemId => itemId === id);
    const value = [ ...this.state.value ];

    if (itemIndex === -1) {
      message.error(this.props.t('itemChooser.messages.notFound'));
      return;
    }

    value[itemIndex] = update;
    this.change(value);
  }

  onDelete = async ({ id }) => {
    const itemIndex = this.state.value.findIndex(itemId => itemId === id);
    const value = [ ...this.state.value ];

    value.splice(itemIndex, 1);
    this.change(value);
  }

  onEdit = item => this.props.editItem(this.props.type, item.id);

  preprocessOption = (item, id) => ((item.id === id || !this.state.value.includes(item.id)) && this.props.excludeId !== item.id ? item : null);

  renderItem = (id, index) => {
    return (
      <Item
        index={ index }
        item={{ id }}
        key={ id }
        style={{ height: '2.8em' }}
        onEdit={ this.props.edition === true ? this.onEdit : null }
        onDelete={ this.onDelete }
        confirmDelete={ this.props.t('cardForm.messages.confirmRemoveModel')}
      >
        <ItemSelect
          type={ this.props.type }
          value={ id }
          preprocess={ item => this.preprocessOption(item, id) }
          onChange={ update => this.onChange(id, update) }
          id={ id }
        />
      </Item>
    );
  };

  onDragEnd = ({ source, destination }) => {
    if (!destination)
      return;

    const value = [ ...this.state.value ];
    const [reordered] = value.splice(source.index, 1);

    value.splice(destination.index, 0, reordered);

    console.log(this.state.value, value);
    this.change(value);
  };

  render() {
    const { t } = this.props;

    return (
      <DragDropContext onDragEnd={ this.onDragEnd }>
        <ItemSelect
          type={ this.props.type }
          placeholder={ t('itemChooser.addItem') }
          preprocess={ this.preprocessOption }
          onChange={ this.onAdd }
          key={ 'new' }
        />
        <Droppable droppableId="droppable">
          { provided => (
            <div
              ref={ provided.innerRef }
            >
              { this.state.value ? this.state.value.map(this.renderItem) : null }
              { provided.placeholder }
            </div>
          ) }
        </Droppable>
      </DragDropContext>
    );
  }
}

const actions = {
  editItem: DeckActions.selectItem
};

export default withTranslation('translation', { withRef: true })(connect(null, actions)(ItemChooser));
