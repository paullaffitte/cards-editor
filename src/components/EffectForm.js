import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Divider, Form, Input, InputNumber, Row, Col } from 'antd'
import DeckActions from '../state/actions/deck';
import ResourcePicker from './ResourcePicker';
import EffectPicker from './EffectPicker';
import { getEditedEffect } from '../state/selectors/deck';

class EffectForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form>
          <Form.Item style={{display: 'none'}}>
            {getFieldDecorator('id')(<Input />)}
          </Form.Item>
          <Form.Item label="Description">
            {getFieldDecorator('description', {
              rules: [{ required: true, message: 'Please set a description' }],
            })(
              <Input placeholder='Death rattle: Invoke a random minion from your deck' />
            )}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create({
  onFieldsChange(props, changedFields) {
    if (props.onChange)
      props.onChange(changedFields);
  },

  mapPropsToFields(props) {
    return Object.keys(props.data).reduce((acc, name) => ({
      ...acc,
      [name]: Form.createFormField({ value: props.data[name] })
    }), {});
  },

  onValuesChange(_, values) {
  },
})(EffectForm);
