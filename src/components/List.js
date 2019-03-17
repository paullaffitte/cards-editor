import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { Popconfirm } from 'antd';
import { getEditedItem, getItems } from '../state/selectors/deck';
import DeckActions from '../state/actions/deck';
import '../styles/List.scss';

class List extends Component {

  selectItem = item => this.props.dispatch(DeckActions.selectItem(this.props.type, item.id));

  addItem    =   () => this.props.dispatch(DeckActions.addItem(this.props.type));

  deleteItem = item => this.props.dispatch(DeckActions.deleteItem(this.props.type, item.id));

  renderItem = item => {
    const backgroundImage = item.thumbnail ? {backgroundImage: `url('${item.thumbnail}')`} : null;
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
    return (
      <div className={'List ' + this.props.type.toLowerCase() + '-list' }>
        <div className="items">
          {this.props.items.map(this.renderItem)}
        </div>
        <button className="new" onClick={this.addItem}>+</button>
      </div>
    );
  }
}

const mapStateToProps = props => state => ({
  type: props.type,
  renderItem: props.renderItem,
  items: props.preprocess(state, getItems(props.type, state)).map(item => ({
    ...item,
    className: [
      'list-item',
      item.id === getEditedItem(props.type, state).id ? 'selected' : '',
      item.updated ? 'updated' : ''
    ].join(' '),
  }))
});

export default props => connect(mapStateToProps(props))(List);
