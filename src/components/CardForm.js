import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, InputNumber, Row, Col, Select, Tabs } from 'antd'
import DeckActions from '../state/actions/deck';
import ResourcePicker from './ResourcePicker';
import EffectPicker from './EffectPicker';
import TransformInput from './TransformInput';
import { getEditedCard } from '../state/selectors/deck';

const { Option } = Select;
const TabPane = Tabs.TabPane;

class CardForm extends Component {

  renderStats = getFieldDecorator => (
    <TabPane tab="Information & stats" key="stats">
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
    </TabPane>
  );

  renderImages = getFieldDecorator => (
    <TabPane tab="Images" key="images">
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
    </TabPane>
  );

  renderTransforms = getFieldDecorator => (
    <TabPane tab="Transforms" key="transforms">
      {getFieldDecorator('thumbnailTransform')(<TransformInput name="Thumbnail" scaleUnit="%" />)}
      {[
        { name: 'Name' },
        { name: 'Description' },
        ...(this.props.data.type !== 'minion' ? [] : [
          { name: 'HP' },
          { name: 'Attack' }
        ])
      ].map(opts => this.renderTransform(opts, getFieldDecorator))}
    </TabPane>
  );

  renderTransform = ({ name }, getFieldDecorator) => {
    const decoratorName = name.toLowerCase() + 'Transform';

    return getFieldDecorator(decoratorName)(<TransformInput key={ name } name={ name } />);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form>
          <Tabs defaultActiveKey="stats">
              {this.renderStats(getFieldDecorator)}
              {this.renderImages(getFieldDecorator)}
              {this.renderTransforms(getFieldDecorator)}
          </Tabs>
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
