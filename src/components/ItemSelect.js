import React, { bindActionCreators, Component } from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { getItems } from '../state/selectors/deck';
import DeckActions from '../state/actions/deck';

const { Option } = Select;

class ItemSelect extends Component {

  renderItem = item => {
    return (
      <Option
        value={ item.id }
        key={ item.id }
      >
        { item.name }
      </Option>
    );
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
        optionFilterProp="name"

        filterOption={ (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
      >
        { items.map(this.renderItem) }
      </Select>
    );
  }
}

const mapStateToProps = state => ({
  items: type => getItems(type, state)
});

const actions = {
  // ...DeckActions
};

export default connect(mapStateToProps, actions)(ItemSelect);
