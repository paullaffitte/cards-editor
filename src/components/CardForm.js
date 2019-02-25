import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Divider, Form, Input, InputNumber, Row, Col } from 'antd'
import DeckActions from '../state/actions/deck';
import ResourcePicker from './ResourcePicker';

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
      this.props.dispatch(DeckActions.updateCard(values));
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

          <Row>
            <Col span={12}>
              <Form.Item label="Thumbnail">
                {getFieldDecorator('thumbnail')(<ResourcePicker />)}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Background">
                {getFieldDecorator('background')(<ResourcePicker />)}
              </Form.Item>
            </Col>
          </Row>

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

const mapStateToProps = state => ({
  data: state.deck.editedCard
});

export default connect(mapStateToProps)(Form.create()(CardForm));
