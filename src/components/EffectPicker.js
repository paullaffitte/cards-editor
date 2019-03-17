import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'antd';
import DeckActions from '../state/actions/deck';
import { getEditedItem } from '../state/selectors/deck';
import ActionsTypes from '../constants/ActionsTypes';
import EffectList from './EffectList';

class EffectPicker extends Component {

  state = {
    selected: []
  }

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        selected: nextProps.value ? nextProps.value : [],
      };
    }
    return null;
  }

  onSelect = async item => {
    let selected;
    if (this.state.selected.includes(item.id))
      selected = this.state.selected.filter(id => id !== item.id);
    else
      selected = [...this.state.selected, item.id];

    const onChange = this.props.onChange;
    if (onChange) {
      onChange(selected);
    }
  }

  addEffect = () => this.props.dispatch(DeckActions.addItem(ActionsTypes.Item.EFFECT));

  onEdit = item => {
    console.log('edit', item);
  }

  preprocess = item => {
    return {
      ...item,
      className: this.state.selected.includes(item.id) ? 'selected' : ''
    };
  }

  render() {
    return (
      <div>
        <EffectList
          onSelect={this.onSelect}
          preprocess={this.preprocess}
          onEdit={this.onEdit}
        />
        <Button onClick={() => this.addEffect()}>
          <Icon type="plus" /> New effect
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  edited: getEditedItem(ActionsTypes.Item.EFFECT, state)
});

export default connect(mapStateToProps)(EffectPicker);
