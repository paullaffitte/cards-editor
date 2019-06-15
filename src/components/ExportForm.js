import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, InputNumber, Row, Col, Tooltip, Icon } from 'antd';
import { withTranslation } from "react-i18next";
import ItemList from './ItemList';
import ActionsTypes from '../constants/ActionsTypes';
import DeckActions from '../state/actions/deck';
import { getResourceById, getExportConfig } from '../state/selectors/deck';
import 'antd/dist/antd.css';

class ExportForm extends Component {

  renderCardListItem = item => {
    const { width, height } = this.props.getResourceById(item.background);
    const { width: expectedWidth, height: expectedHeight } = this.props.cardSize;
    const invalidSize = !width || !height;
    const sizeMismatch = width !== expectedWidth || height !== expectedHeight;

    const { getFieldDecorator } = this.props.form;
    const warning = message => (
      <Tooltip title={message}>
        <Icon type='warning' theme="twoTone" twoToneColor="orange" />{' '}
      </Tooltip>
    );

    return (
      <div>
        { invalidSize
          ? (warning(`This card doesn't has any background. However, this card will take the same size than other cards. (${expectedWidth}x${expectedHeight})`))
          : null }
        { !invalidSize && sizeMismatch
          ? (warning(`The background's size of this card doesn't match others cards' backgrounds sizes (expected to be ${expectedWidth}x${expectedHeight} but is ${width}x${height})`))
          : null }
        <span>
          { item.name }
        </span>
        {getFieldDecorator(item.id, {})(
          <InputNumber min={0} style={{
            width: '5em',
            marginRight: '1em',
            position: 'relative',
            float: 'right',
          }} />
        )}
      </div>
    )
  };

  render() {
    const { form, t } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form>
        <h2>{ t('export.printSettings') }</h2>
        <Row>
          <Col span={12}>
            <Form.Item label={ t('export.dpi') }>
              {getFieldDecorator('dpi', {})(
                <InputNumber min={45} step={5} />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={ `${t('export.spacing')} (mm)`}>
              {getFieldDecorator('spacing', {})(
                <InputNumber min={5} />
              )}
            </Form.Item>
          </Col>
        </Row>

        <h2>{ t('export.cardsQuantity') }</h2>
        <ItemList
          type={ ActionsTypes.Item.CARD }
          prefix="export"
          preprocess={ ({thumbnail, ...item}, state) => item }
          sort={ (left, right) => {
            left = this.props.exportConfig.cardsQuantity[left.id];
            right = this.props.exportConfig.cardsQuantity[right.id];

            if (left === undefined)
              return 1;
            if (right === undefined)
              return -1;
            return left < right
          } }
          renderItem={ this.renderCardListItem }
        />
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  deck: state.deck.current,
  exportConfig: getExportConfig(state),
  cardSize: state.deck.cardSize,

  getResourceById: id => getResourceById(state, id)
});

export default withTranslation()(connect(mapStateToProps)(Form.create({
  onFieldsChange(props, changedFields) {
    if (props.onChange)
      props.onChange(changedFields);

    const exportConfig = Object.keys(changedFields).reduce((acc, name) => {
      if (![ 'dpi', 'spacing' ].includes(name))
        return acc;

      const field = changedFields[name];
      delete changedFields[name];

      return field
        ? { ...acc, [name]: field.value}
        : acc;
    }, { ...props.exportConfig });

    const cardsQuantity = Object.keys(changedFields).reduce((acc, name) => ({
      ...acc,
      [name]: changedFields[name].value
    }), { ...props.exportConfig.cardsQuantity });

    exportConfig.cardsQuantity = cardsQuantity;
    props.dispatch(DeckActions.updateExportConfig(exportConfig));
  },

  mapPropsToFields(props) {
    const cardsQuantity = props.exportConfig.cardsQuantity;
    return Object.keys(cardsQuantity).reduce((acc, name) => acc[name] ? acc : ({
      ...acc,
      [name]: Form.createFormField({ value: cardsQuantity[name] })
    }), {
      dpi: Form.createFormField({ value: props.exportConfig.dpi }),
      spacing: Form.createFormField({ value: props.exportConfig.spacing }),
    });
  },

  onValuesChange(_, values) {
  },
})(ExportForm)));
