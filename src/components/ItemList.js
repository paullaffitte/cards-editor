import React, { Component } from 'react';
import { connect } from 'react-redux';
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

  onReorder = async (source, destination) => {
    const items = this.props.items(this.props.type, this.props.preprocess);
    await this.props.dispatch(DeckActions.reorderItem(this.props.type, items[source].index, items[destination].index));
  };

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
        itemStyle={{  }}
        onSelect={ this.selectItem }
        onDelete={ this.deleteItem }
        onEdit={ this.props.onEdit ? this.editItem : null }
        onReorder={ this.onReorder }
      />
    );
  }
}

const mapStateToProps = state => ({
  items: (type, preprocess) => getItems(type, state)
    .map((item, index) => {
      const preprocessed = preprocess(item, state);

      if (!preprocessed)
        return null;

      preprocessed.index = index;
      return preprocessed;
    })
    .filter(Boolean)
});

export default connect(mapStateToProps)(ItemList);
