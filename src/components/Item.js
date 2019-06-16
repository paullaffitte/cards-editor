import React, { Component } from 'react';
import { Icon } from 'antd';
import { Popconfirm } from 'antd';
import { withTranslation } from "react-i18next";
import { Draggable } from 'react-beautiful-dnd';
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
    const { className, style, t } = this.props;

    if (!this.props.item.id) {
      return null;
    }

    return (
      <Draggable draggableId={ this.props.item.id } index={ this.props.index }>
        { provided => (
          <div
            className={ 'Item ' + (className ? className : '') }
            { ...provided.draggableProps }
            style={{ ...provided.draggableProps.style, ...style }}
            ref={ provided.innerRef }
          >
            { this.props.confirmDelete ? (
              <Popconfirm className="item-button delete"
                title={ this.props.confirmDelete === true ? t('messages.confirmDeleteItem') : this.props.confirmDelete } placement="left"
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
            <div onClick={ () => this.selectItem(false) } className="full-size" { ...provided.dragHandleProps }>
              { this.props.children }
            </div>
          </div>
        ) }
      </Draggable>
    );
  }
}

export default withTranslation('translation', { withRef: true })(Item);
