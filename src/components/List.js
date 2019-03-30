import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { Popconfirm } from 'antd';
import { getItems } from '../state/selectors/deck';
import DeckActions from '../state/actions/deck';
import '../styles/List.scss';

class List extends Component {

  selectItem = (item, edit) => {
    if (!edit) {
      if (!this.props.onEdit)
        this.props.dispatch(DeckActions.selectItem(this.props.type, item.id))
      if (this.props.onSelect)
        this.props.onSelect(item);
    } else {
      this.props.dispatch(DeckActions.selectItem(this.props.type, item.id))
      if (this.props.onEdit)
        this.props.onEdit(item);
    }
  };

  deleteItem = item => this.props.dispatch(DeckActions.deleteItem(this.props.type, item.id));

  renderItem = item => {
    const backgroundImage = item.thumbnail ? {backgroundImage: `url('${item.thumbnail}')`} : null;
    const className        = [ 'list-item', item.updated ? 'updated' : '', item.className ].join(' ');

    return (
      <div key={item.id} className={className} style={backgroundImage}>
        <Popconfirm className="list-item-button delete"
          title="Are you sure to delete this item ? (it can't be undone)" placement="left"
          onConfirm={() => this.deleteItem(item)}
          okText="Yes" cancelText="No">
          <Icon type="close" />
        </Popconfirm>
        { !this.props.onEdit ? null : <Icon type="edit" className="list-item-button edit" onClick={() => this.selectItem(item, true)} /> }
        <div className="content" onClick={() => this.selectItem(item)}>
          {this.props.renderItem(item)}
        </div>
      </div>
    );
  };

  render() {
    const prefix = this.props.prefix ? (this.props.prefix + '-') : '';

    return (
      <div className={'List ' + prefix + this.props.type.toLowerCase() + '-list' }>
        <div className="items">
          {this.props.items(this.props.type, this.props.preprocess).map(this.renderItem)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  items: (type, preprocess) => getItems(type, state).map(item => preprocess(item, state)).filter(Boolean)
});

export default connect(mapStateToProps)(List);
