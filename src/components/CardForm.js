import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Divider, Form, Input, InputNumber, Row, Col, Select } from 'antd'
import DeckActions from '../state/actions/deck';
import ResourcePicker from './ResourcePicker';
import EffectPicker from './EffectPicker';
import { getEditedCard } from '../state/selectors/deck';

const { Option } = Select;

class CardForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form>
          <Form.Item label="Type">
            {getFieldDecorator('type', {
              rules: [{ required: true, message: 'Please choose a type type' }],
            })(
              <Select>
                <Option value="minion">Minion</Option>
                <Option value="spell">Spell</Option>
              </Select>
            )}
          </Form.Item>
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
              <Input.TextArea placeholder='Some words about the card' rows={4} />
            )}
          </Form.Item>

          { this.props.data.type !== 'minion' ? null :
            (
              <Row>
                <Col span={12}>
                  <Form.Item label="HP">
                    {getFieldDecorator('hp', {
                      rules: [],
                    })(
                    <InputNumber />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Attack">
                    {getFieldDecorator('attack', {
                      rules: [],
                    })(
                    <InputNumber />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            )
          }

          <Form.Item label="Effects">
            {getFieldDecorator('effects')(<EffectPicker />)}
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

          <Row>
            <h3>Thumbnail</h3>
            <Col span={8}>
              <Form.Item label="X(%)">
                {getFieldDecorator('thumbnailX')(<InputNumber step={5}/>)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Y(%)">
                {getFieldDecorator('thumbnailY')(<InputNumber step={5}/>)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Scale">
                {getFieldDecorator('thumbnailScale')(<InputNumber step={0.1} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: getEditedCard(state)
});

export default connect(mapStateToProps)(Form.create({
  onFieldsChange(props, changedFields) {
    if (props.onChange)
      props.onChange(changedFields);

    const card = Object.keys(changedFields).reduce((acc, key) => ({...acc, [changedFields[key].name]: changedFields[key].value}), {id: props.data.id});
    props.dispatch(DeckActions.updateCard(card));
  },

  mapPropsToFields(props) {
    return Object.keys(props.data).reduce((acc, name) => ({
      ...acc,
      [name]: Form.createFormField({ value: props.data[name] })
    }), {});
  },

  onValuesChange(_, values) {
  },
})(CardForm));
