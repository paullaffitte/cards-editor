import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Modal } from 'antd';
import DeckActions from '../state/actions/deck';
import { getEditedEffect } from '../state/selectors/deck';
import ActionsTypes from '../constants/ActionsTypes';
import EffectList from './EffectList';
import EffectForm from './EffectForm'

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
    this.toggleModal(true);
  }

  preprocess = item => {
    return {
      ...item,
      className: this.state.selected.includes(item.id) ? 'selected' : ''
    };
  }

  toggleModal = visible => {
    this.setState({ modalOpened: visible !== undefined ? (visible === true) : !this.state.modalOpened });
  };

  onSubmit = () => {
    this.refs.effectForm.validateFields((err, effect) => {
      if (!err) {
        this.props.dispatch(DeckActions.updateEffect(effect));
        this.toggleModal(false);
      } else {
        console.error(err);
      }
    });
  };

  onCancel = () => this.toggleModal(false);

  render() {
    return (
      <div className="EffectPicker">
        <Button onClick={() => this.addEffect()} style={{ marginBottom: '0.5em' }}>
          <Icon type="plus" /> New effect
        </Button>
        <EffectList
          onSelect={this.onSelect}
          preprocess={this.preprocess}
          onEdit={this.onEdit}
        />

        <Modal
          ref="modal"
          visible={this.state.modalOpened}
          onCancel={this.onCancel}
          onOk={this.onSubmit}
        >
          <EffectForm ref='effectForm' data={this.props.edited}/>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  edited: getEditedEffect(state)
});

export default connect(mapStateToProps)(EffectPicker);
