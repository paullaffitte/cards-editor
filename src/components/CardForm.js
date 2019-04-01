import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, InputNumber, Row, Col, Select, Tabs } from 'antd'
import DeckActions from '../state/actions/deck';
import ResourcePicker from './ResourcePicker';
import EffectPicker from './EffectPicker';
import TransformInput from './TransformInput';
import { getEditedCard, getCardsConfig } from '../state/selectors/deck';

const { Option } = Select;
const TabPane = Tabs.TabPane;

class CardForm extends Component {

  state = { globalTransform: false }

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
      <Form.Item label="Effects">
        {getFieldDecorator('effects')(<EffectPicker />)}
      </Form.Item>
    </TabPane>
  );

  renderImages = getFieldDecorator => (null
  );

  renderTransforms = (getFieldDecorator, isGlobal) => [
    'Name',
    'Description',
    ...(!isGlobal && this.props.data.type !== 'minion' ? [] : [
      'HP',
      'Attack'
    ])
  ].map(opts => this.renderTransform(isGlobal, opts, getFieldDecorator));

  renderTransform = (isGlobal, name, getFieldDecorator) => {
    const valueName = name.toLowerCase() + 'Transform';

    return isGlobal
      ? <TransformInput key={ 'global-' + valueName } name={ name } value={this.props.cardsConfig[valueName]} onChange={ this.updateCardsConfig(valueName) } />
      : getFieldDecorator(valueName)(<TransformInput key={ valueName } name={ name } />);
  };

  updateCardsConfig = name => configField => this.props.dispatch(DeckActions.updateCardsConfig({[name]: configField}));
  toggleGlobalTransforms = enabled => this.setState({ globalTransform: enabled });

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form>
          <Tabs defaultActiveKey="stats">
              {this.renderStats(getFieldDecorator)}
              {this.renderImages(getFieldDecorator)}

              <TabPane tab="Transforms" key="transforms">
                {this.renderTransforms(getFieldDecorator)}
                {getFieldDecorator('thumbnailTransform')(<TransformInput name="Thumbnail" scaleUnit="%" withoutColor={true} />)}
              </TabPane>

              <TabPane tab="Global" key="global">
                {this.renderTransforms(getFieldDecorator, true)}
              </TabPane>
          </Tabs>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: getEditedCard(state),
  cardsConfig: getCardsConfig(state)
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
