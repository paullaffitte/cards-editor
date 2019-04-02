import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, InputNumber, Row, Col } from 'antd';
import List from './List';
import ActionsTypes from '../constants/ActionsTypes';
import DeckActions from '../state/actions/deck';
import 'antd/dist/antd.css';

class ExportForm extends Component {

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <h2>Print settings</h2>
        <Row>
          <Col span={12}>
            <Form.Item label="DPI">
              {getFieldDecorator('dpi', {})(
                <InputNumber min={45} step={5} />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Spacing (mm)">
              {getFieldDecorator('spacing', {})(
                <InputNumber min={5} />
              )}
            </Form.Item>
          </Col>
        </Row>

        <h2>Cards quantity</h2>
        <List
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
          renderItem={ item => (
            <div>
              <span>{item.name}</span>
              {getFieldDecorator(item.id, {})(
                <InputNumber min={0} style={{
                  width: '5em',
                  marginRight: '1em',
                  position: 'relative',
                  float: 'right',
                }} />
              )}
            </div>
          ) }
        />
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  deck: state.deck.current,
  exportConfig: state.deck.current.exportConfig
});

export default connect(mapStateToProps)(Form.create({
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
})(ExportForm));
