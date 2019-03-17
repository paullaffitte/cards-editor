import React, { Component } from 'react';
import DeckActions from '../state/actions/deck';
import EffectList from './EffectList';

class EffectPicker extends Component {

  state = {
    selected: []
  }

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        selected: nextProps.value,
      };
    }
    return null;
  }

  onSelect = async item => {
    let selected;
    if (this.state.selected.includes(item.id))
      selected = this.state.selected.filter(id => id != item.id);
    else
      selected = [...this.state.selected, item.id];

    const onChange = this.props.onChange;
    if (onChange) {
      onChange(selected);
    }
  }

  preprocess = item => {
    return {
      ...item,
      className: this.state.selected.includes(item.id) ? 'selected' : ''
    };
  }

  render() {
    return (
      <EffectList
        onSelect={this.onSelect}
        preprocess={this.preprocess}
        />
    );
  }
}

export default EffectPicker;
