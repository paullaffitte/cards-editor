import React, { Component } from 'react';
import { Icon } from 'antd';
import { Popconfirm } from 'antd';
import '../styles/Item.scss';

class Item extends Component {

  selectItem = edit => {
    if (edit && this.props.onEdit) {
      this.props.onEdit(this.props.item);
    } else if (this.props.onSelect) {
      this.props.onSelect(this.props.item);
    }
  };

  deleteItem = () => {
    if (this.props.onDelete) {
      this.props.onDelete(this.props.item);
    }
  };

  render() {
    const { className, style } = this.props;

    return (
      <div className={ 'Item ' + (className ? className : '') } style={ style }>
        { this.props.confirmDelete ? (
          <Popconfirm className="item-button delete"
            title={ this.props.confirmDelete === true ? "Are you sure to delete this item ? (it can't be undone)" : this.props.confirmDelete } placement="left"
            onConfirm={ this.deleteItem }
            okText="Yes" cancelText="No">
            <Icon type="close" />
          </Popconfirm>
        ) : (
          <div className="item-button delete">
            <Icon type="close" onClick={ this.deleteItem } />
          </div>
        ) }
        { !this.props.onEdit ? null : <Icon type="edit" className="item-button edit" onClick={ () => this.selectItem(true) } /> }
        <div onClick={ () => this.selectItem(false) } className="full-size">
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default Item;
