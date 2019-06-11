import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Item from './Item';
import '../styles/List.scss';

class List extends Component {

  renderItem = (item, index) => {
    return (
      <Item
        className={ item.className + ' hoverable' }
        style={ this.props.itemStyle }
        item={ item }
        key={ item.id }
        index={ index }
        onEdit={ this.props.onEdit }
        onSelect={ this.props.onSelect }
        onDelete={ this.props.onDelete }
        confirmDelete={ this.props.confirmDelete === undefined ? true : this.props.confirmDelete }
      >
        { this.props.renderItem(item) }
      </Item>
    );
  };

  onDragEnd = ({ source, destination }) => {
    if (!this.props.onReorder || !destination) {
      return;
    }

    this.props.onReorder(source.index, destination.index);
  };

  render() {
    const items = [ ...this.props.items ];

    if (this.props.sort)
      items.sort(this.props.sort);

    return (
      <DragDropContext onDragEnd={ this.onDragEnd }>
        <Droppable droppableId="droppable">
          { provided => (
            <div
              className={'List ' + this.props.prefix + '-list' }
              style={ this.props.style }
              ref={ provided.innerRef }
              { ...provided.droppableProps }
            >
              <div className="items">
                { (items).map(this.renderItem) }
                { provided.placeholder }
              </div>
            </div>
          ) }
        </Droppable>
      </DragDropContext>
    );
  }
}

export default List;
