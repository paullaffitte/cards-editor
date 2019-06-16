import React, { Component } from 'react';
import { Form, Input } from 'antd'
import { withTranslation } from "react-i18next";

class EffectForm extends Component {
  render() {
    const { form, t } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form>
        <Form.Item style={{ display: 'none' }}>
          {getFieldDecorator('id')(<Input />)}
        </Form.Item>
        <Form.Item label={ t('effectForm.description') }>
          {getFieldDecorator('description', {
            rules: [{ required: true, message: t('effectForm.messages.descriptionRequired') }],
          })(
            <Input placeholder={ t('effectForm.descriptionPlaceholder') }/>
          )}
        </Form.Item>
      </Form>
    );
  }
}

export default withTranslation('translation', { withRef: true })(Form.create({
  onFieldsChange(props, changedFields) {
    if (props.onChange)
      props.onChange(changedFields);
  },

  mapPropsToFields(props) {
    return Object.keys(props.data).reduce((acc, name) => ({
      ...acc,
      [name]: Form.createFormField({ value: props.data[name] })
    }), {});
  },

  onValuesChange(_, values) {
  },
})(EffectForm));
