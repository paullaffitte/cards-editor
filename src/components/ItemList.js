import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { Popconfirm } from 'antd';
import { getItems } from '../state/selectors/deck';
import DeckActions from '../state/actions/deck';
import FakeBackground from './FakeBackground';
import List from './List';

class ItemList extends Component {

  selectItem = item => {
    this.props.dispatch(DeckActions.selectItem(this.props.type, item.id));
    if (this.props.onSelect)
      this.props.onSelect(item);
  };

  editItem = item => {
    this.props.dispatch(DeckActions.selectItem(this.props.type, item.id));
    if (this.props.onEdit)
      this.props.onEdit(item);
  }

  deleteItem = item => this.props.dispatch(DeckActions.deleteItem(this.props.type, item.id));

  renderItem = item => {
    return (
      <FakeBackground src={ item.thumbnail }>
        <div className="content">
          {this.props.renderItem(item)}
        </div>
      </FakeBackground>
    );
  };

  render() {
    const prefix = [ this.props.prefix, this.props.type.toLowerCase() ].filter(Boolean).join('-');
    const items = this.props.items(this.props.type, this.props.preprocess);

    if (this.props.sort)
      items.sort(this.props.sort);

    return (
      <List
        prefix={ prefix }
        items={ items.map(item => {
          item.className = [ item.updated ? 'updated' : '', item.className ].join(' ')
          return item;
        }) }
        renderItem={ this.renderItem }
        itemStyle={{ position: 'relative' }}
        onSelect={ this.selectItem }
        onDelete={ this.deleteItem }
        onEdit={ this.props.onEdit ? this.editItem : null }
      />
    );
  }
}

const mapStateToProps = state => ({
  items: (type, preprocess) => getItems(type, state).map(item => preprocess(item, state)).filter(Boolean)
});

export default connect(mapStateToProps)(ItemList);
