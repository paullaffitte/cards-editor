import React, { Component } from 'react';
import { Icon } from 'antd';
import { Popconfirm } from 'antd';
import '../styles/List.scss';

class Item extends Component {

  selectItem = (item, edit) => {
    if (edit && this.props.onEdit) {
      this.props.onEdit(item);
    } else if (this.props.onSelect) {
      this.props.onSelect(item);
    }
  };

  deleteItem = item => {
    if (this.props.onDelete) {
      this.props.onDelete(item);
    }
  };

  render() {
    const item = this.props.item;

    return (
      <div className={ this.props.className } style={ this.props.itemStyle }>
        <Popconfirm className="list-item-button delete"
          title={ this.props.title ? this.props.title : "Are you sure to delete this item ? (it can't be undone)"} placement="left"
          onConfirm={() => this.deleteItem(item)}
          okText="Yes" cancelText="No">
          <Icon type="close" />
        </Popconfirm>
        { !this.props.onEdit ? null : <Icon type="edit" className="list-item-button edit" onClick={() => this.selectItem(item, true)} /> }
        <div onClick={() => this.selectItem(item)} className="full-size">
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default Item;
