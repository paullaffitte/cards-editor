import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, InputNumber } from 'antd';
import List from './List';
import ActionsTypes from '../constants/ActionsTypes';
import DeckActions from '../state/actions/deck';
import 'antd/dist/antd.css';

class ExportForm extends Component {

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <h2>Cards quantity</h2>
        <List
          type={ ActionsTypes.Item.CARD }
          prefix="export"
          preprocess={ (item, state) => item }
          renderItem={ item => (
            <div>
              <span>{item.name}</span>
              {getFieldDecorator(item.id, {})(
                <InputNumber style={{
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

let cardsQuantity = {};
export default connect(mapStateToProps)(Form.create({
  onFieldsChange(props, changedFields) {
    if (props.onChange)
      props.onChange(changedFields);

    cardsQuantity = Object.keys(changedFields).reduce((acc, name) => ({
      ...acc,
      [name]: changedFields[name].value
    }), cardsQuantity);
    props.dispatch(DeckActions.updateExportConfig({cardsQuantity}));
  },

  mapPropsToFields(props) {
    const cardsQuantity = props.exportConfig.cardsQuantity;
    return Object.keys(cardsQuantity).reduce((acc, name) => ({
      ...acc,
      [name]: Form.createFormField({ value: cardsQuantity[name] })
    }), {});
  },

  onValuesChange(_, values) {
  },
})(ExportForm));
