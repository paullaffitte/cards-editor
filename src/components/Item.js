import React, { Component } from 'react';
import { Icon } from 'antd';
import { Popconfirm } from 'antd';
import '../styles/Item.scss';

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
    const { item, className, style } = this.props;

    return (
      <div className={ 'Item ' + (className ? className : '') } style={ style }>
        { this.props.confirmDelete ? (
          <Popconfirm className="item-button delete"
            title={ this.props.confirmDelete === true ? "Are you sure to delete this item ? (it can't be undone)" : this.props.confirmDelete } placement="left"
            onConfirm={ () => this.deleteItem(item) }
            okText="Yes" cancelText="No">
            <Icon type="close" />
          </Popconfirm>
        ) : (
          <div className="item-button delete">
            <Icon type="close" onClick={() => this.deleteItem(item)} />
          </div>
        ) }
        { !this.props.onEdit ? null : <Icon type="edit" className="item-button edit" onClick={() => this.selectItem(item, true)} /> }
        <div onClick={() => this.selectItem(item)} className="full-size">
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default Item;
