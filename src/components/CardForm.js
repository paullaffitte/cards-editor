import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, Input, InputNumber, Row, Col, Select, Tabs } from 'antd'
import { withTranslation } from "react-i18next";
import DeckActions from '../state/actions/deck';
import ResourcePicker from './ResourcePicker';
import EffectPicker from './EffectPicker';
import TransformInput from './TransformInput';
import ItemChooser from './ItemChooser';
import { getEditedCard } from '../state/selectors/deck';
import ActionsTypes from '../constants/ActionsTypes';

const { Option } = Select;
const TabPane = Tabs.TabPane;

class CardForm extends Component {

  renderStats = getFieldDecorator => (
    <Fragment>
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

      <Row>
        <Col span={12}>
          <Form.Item label="Effects">
            {getFieldDecorator('effects')(<EffectPicker />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Models">
            {getFieldDecorator('models')(
              <ItemChooser type={ ActionsTypes.Item.CARD } edition={ true } excludeId={ this.props.data.id }/>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Fragment>
  );

  renderTransforms = getFieldDecorator => [
    'Name',
    'Description',
    ...(this.props.data.type !== 'minion' ? [] : [
      'HP',
      'Attack'
    ])
  ].map(opts => this.renderTransform(opts, getFieldDecorator));

  renderTransform = (name, getFieldDecorator) => {
    const valueName = name.toLowerCase() + 'Transform';

    return getFieldDecorator(valueName)(
      <TransformInput key={ valueName } name={ name } />
    );
  };

  render() {
    const { t, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
        <Form>
          <Tabs defaultActiveKey="stats">
            <TabPane tab={ t('tabs.infoAndStats') } key="stats">
              {this.renderStats(getFieldDecorator)}
            </TabPane>

            <TabPane tab={ t('tabs.transforms') } key="transforms">
              {this.renderTransforms(getFieldDecorator)}
              {getFieldDecorator('thumbnailTransform')(<TransformInput name="Thumbnail" scaleUnit="%" disableTextOption={true} />)}
            </TabPane>
          </Tabs>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: getEditedCard(state)
});

export default withTranslation()(connect(mapStateToProps)(Form.create({
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
})(CardForm)));
