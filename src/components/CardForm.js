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

  renderStats = getFieldDecorator => {
    const { t } = this.props;

    return (
      <Fragment>
        <Form.Item label={ t('cardForm.type') }>
          {getFieldDecorator('type')(
            <Select>
              <Option value="minion">{ t('cardTypes.minion') }</Option>
              <Option value="spell">{ t('cardTypes.spell') }</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label={ t('cardForm.name') }>
          {getFieldDecorator('name')(
            <Input placeholder='Zavata' />
          )}
        </Form.Item>
        <Form.Item label={ t('cardForm.description') }>
          {getFieldDecorator('description')(
            <Input.TextArea placeholder={ t('cardForm.descriptionPlaceholder') } rows={4} />
          )}
        </Form.Item>

        { this.props.data.type !== 'minion' ? null :
          (
            <Row>
              <Col span={12}>
                <Form.Item label={ t('cardForm.hp') }>
                  {getFieldDecorator('hp')(
                    <InputNumber />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={ t('cardForm.attack') }>
                  {getFieldDecorator('attack')(
                    <InputNumber />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )
        }

        <Row>
          <Col span={12}>
            <Form.Item label={ t('cardForm.thumbnail') }>
              {getFieldDecorator('thumbnail')(<ResourcePicker />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={ t('cardForm.background') }>
              {getFieldDecorator('background')(<ResourcePicker />)}
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Form.Item label={ t('cardForm.effects') }>
              {getFieldDecorator('effects')(<EffectPicker />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={ t('cardForm.models') }>
              {getFieldDecorator('models')(
                <ItemChooser type={ ActionsTypes.Item.CARD } edition={ true } excludeId={ this.props.data.id }/>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Fragment>
    );
  }

  renderTransforms = getFieldDecorator => [
    'Name',
    'Description',
    ...(this.props.data.type !== 'minion' ? [] : [
      'HP',
      'Attack'
    ])
  ].map(opts => this.renderTransform(opts, getFieldDecorator));

  renderTransform = (name, getFieldDecorator) => {
    const lowerName = name.toLowerCase();
    const valueName = lowerName + 'Transform';

    return getFieldDecorator(valueName)(
      <TransformInput key={ valueName } name={ this.props.t(`cardForm.${lowerName}`) } />
    );
  };

  render() {
    const { t, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
        <Form>
          <Tabs defaultActiveKey="stats">
            <TabPane tab={ t('cardForm.tabs.infoAndStats') } key="stats">
              {this.renderStats(getFieldDecorator)}
            </TabPane>

            <TabPane tab={ t('cardForm.tabs.transforms') } key="transforms">
              {this.renderTransforms(getFieldDecorator)}
              {getFieldDecorator('thumbnailTransform')(<TransformInput name={ t('cardForm.thumbnail') } scaleUnit="%" disableTextOption={true} />)}
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
