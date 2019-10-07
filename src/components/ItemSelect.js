import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { getItems, getItemById } from '../state/selectors/deck';

const { Option } = Select;

class ItemSelect extends Component {

  renderItem = item => {
    const parentId = (this.props.id ? this.props.id : '');

    return (
      <Option
        value={ item.id }
        key={ item.id + '-' + parentId }
      >
        { item.name ? item.name : <span className="comment">no name</span> }
      </Option>
    );
  };

  onChange = id => {
    if (!this.props.onChange)
      return;

    this.props.onChange(id);
  };

  render() {
    const items = this.props.items(this.props.type, this.props.preprocess ? this.props.preprocess : (i => i));

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
        filterOption={ (input, option) => (typeof option.props.children == 'string' ? option.props.children : '').toLowerCase().indexOf(input.toLowerCase()) >= 0 }
      >
        { items.map(this.renderItem) }
      </Select>
    );
  }
}

const mapStateToProps = state => ({
  items: (type, preprocess) => getItems(type, state).map(item => preprocess(item, state)).filter(Boolean),
  getItem: (type, id) => getItemById({ type, id })
});

export default connect(mapStateToProps)(ItemSelect);
