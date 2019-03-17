import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { Popconfirm } from 'antd';
import { getItems } from '../state/selectors/deck';
import DeckActions from '../state/actions/deck';
import '../styles/List.scss';

class List extends Component {

  selectItem = item => {
    this.props.dispatch(DeckActions.selectItem(this.props.type, item.id))

    if (this.props.onSelect)
      this.props.onSelect(item);
  };

  deleteItem = item => this.props.dispatch(DeckActions.deleteItem(this.props.type, item.id));

  renderItem = item => {
    const backgroundImage = item.thumbnail ? {backgroundImage: `url('${item.thumbnail}')`} : null;
    item.className        = [ 'list-item', item.updated ? 'updated' : '', item.className].join(' ');

    return (
      <div key={item.id} className={item.className} style={backgroundImage}>
        <Popconfirm className="delete"
          title="Are you sure to delete this item ? (it can't be undone)" placement="left"
          onConfirm={() => this.deleteItem(item)}
          okText="Yes" cancelText="No">
          <Icon type="close" />
        </Popconfirm>
        <div className="content" onClick={() => this.selectItem(item)}>
          {this.props.renderItem(item)}
        </div>
      </div>
    );
  };

  render() {
    const preprocess = this.props.preprocess ? this.props.preprocess : item => item;
    return (
      <div className={'List ' + this.props.type.toLowerCase() + '-list' }>
        <div className="items">
          {this.props.items(this.props.type, this.props.preprocess).map(this.renderItem)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  items: (type, preprocess) => getItems(type, state).map(item => preprocess(item, state))
});

export default connect(mapStateToProps)(List);
