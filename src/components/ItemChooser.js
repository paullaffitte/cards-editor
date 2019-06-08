import React, { bindActionCreators, Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Select, message } from 'antd';
import DeckActions from '../state/actions/deck';
import ItemSelect from './ItemSelect';

const { Option } = Select;

class ItemChooser extends Component {

  state = {
    value: []
  }

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  onAdd = id => {
    if (this.state.value.findIndex(itemId => itemId === id) == -1) {
      this.setState({ value: [ ...this.state.value, id ] });
    } else {
      message.warning('Model already added');
    }
  };

  onChange = (id, update) => {
    const itemIndex = this.state.value.findIndex(itemId => itemId === id);
    const value = [ ...this.state.value ];

    if (itemIndex == -1) {
      throw new Error('Item not found');
    }
    value[itemIndex] = update;
    this.setState({ value });
  }

  renderItem = (id) => {
    return (
      <ItemSelect
        type={ this.props.type }
        value={ id }
        onChange={ update => this.onChange(id, update) }
        key={ id }
        id={ id }
      />
    );
  };

  render() {
    return (
      <Fragment>
        <ItemSelect
          type={ this.props.type }
          value={ 'Add a model' }
          onChange={ this.onAdd }
          key={ 'new' }
        />
        { this.state.value ? this.state.value.map(this.renderItem) : null }
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  // items: type => getItems(type, state)
});

const actions = {
  // ...DeckActions
};

export default connect(mapStateToProps, actions)(ItemChooser);
