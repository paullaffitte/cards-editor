import React, { Component } from 'react';
import { Form, Input } from 'antd'

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
