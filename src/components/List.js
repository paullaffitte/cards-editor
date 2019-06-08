import React, { Component } from 'react';
import { Icon } from 'antd';
import { Popconfirm } from 'antd';
import Item from './Item';
import '../styles/List.scss';

class List extends Component {

  renderItem = item => {
    const className = [ 'list-item', item.className ].join(' ');
    return (
      <Item
        className={ className }
        item={ item }
        key={ item.id }
        onEdit={ this.props.onEdit }
        onSelect={ this.props.onSelect }
        onDelete={ this.props.onDelete }
      >
        { this.props.renderItem(item) }
      </Item>
    );
  };

  render() {
    const items = [ ...this.props.items ];

    if (this.props.sort)
      items.sort(this.props.sort);

    return (
      <div className={'List ' + this.props.prefix + '-list' } style={ this.props.style }>
        <div className="items">
          { (items).map(this.renderItem) }
        </div>
      </div>
    );
  }
}

export default List;
