import React, { bindActionCreators, Component } from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { getItems, getItemById } from '../state/selectors/deck';
import DeckActions from '../state/actions/deck';
import Item from './Item';

const { Option } = Select;

class ItemSelect extends Component {

  renderItem = item => {
    const parentId = (this.props.id ? this.props.id : '');

    console.log(item.id + '-' + parentId, this.props.id, this.props.type)

    return (
      <Option
        value={ item.id }
        key={ item.id + '-' + parentId }
      >
        { item.name }
      </Option>
    );
  };

  onChange = id => {
    if (!this.props.onChange)
      return;

    console.log('this.props.onChange(id)', id)
    this.props.onChange(id);
  };

  render() {
    const items = this.props.items(this.props.type);

    if (this.props.sort)
      items.sort(this.props.sort);

    return (
      <Select
        className="ItemSelect"
        showSearch
        style={{ width: 200, ...(this.props.style ? this.props.style : {}) }}
        placeholder={ this.props.placeholder ? this.props.placeholder : 'Select an item' }
        value={ this.props.value }
        onChange={ this.onChange }
        onFocus={ this.props.onFocus ? this.props.onFocus : null }
        onBlur={ this.props.onBlur ? this.props.onBlur : null }
        onSearch={ this.props.onSearch ? this.props.onSearch : null }
        optionFilterProp="name"
        filterOption={ (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
      >
        { items.map(this.renderItem) }
      </Select>
    );
  }
}

const mapStateToProps = state => ({
  items: type => getItems(type, state),
  getItem: (type, id) => getItemById({ type, id })
});

const actions = {
  // ...DeckActions
};

export default connect(mapStateToProps, actions)(ItemSelect);
