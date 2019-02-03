import React, { Component } from 'react';
import { Button, Divider, Form, Input, InputNumber } from 'antd'
import PropTypes from 'prop-types';

class CardForm extends Component {

  componentDidMount() {
    this.props.form.setFieldsValue({...this.props.data, id: undefined});
    this.props.form.validateFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      values.id = this.props.data.id;
      this.props.onSave(values);
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="Card name">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please set a name' }],
            })(
              <Input placeholder='Zavata' />
            )}
          </Form.Item>
          <Form.Item label="Description">
            {getFieldDecorator('description', {
              rules: [{ required: true, message: 'Please set a description' }],
            })(
              <Input.TextArea  placeholder='Some words about the card' rows={4} />
            )}
          </Form.Item>
          <Form.Item label="HP">
            {getFieldDecorator('hp', {
              rules: [],
            })(
            <InputNumber  />
            )}
          </Form.Item>
          <Form.Item label="Attack">
            {getFieldDecorator('attack', {
              rules: [],
            })(
            <InputNumber  />
            )}
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              // disabled={hasErrors(getFieldsError())}
            >Save</Button>
        </Form.Item>
        </Form>
      </div>
    );
  }
}

CardForm.propTypes = {
  data: PropTypes.object,
  onSave: PropTypes.func,
};

export default Form.create()(CardForm);
