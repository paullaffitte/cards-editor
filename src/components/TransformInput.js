import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, InputNumber, Row, Col, Select, Tabs } from 'antd'
import DeckActions from '../state/actions/deck';
import ResourcePicker from './ResourcePicker';
import EffectPicker from './EffectPicker';
import { getEditedCard } from '../state/selectors/deck';

const { Option } = Select;
const TabPane = Tabs.TabPane;

class TransformInput extends Component {

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        x: undefined,
        y: undefined,
        scale: undefined,
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = { ...props.value };
  }

  handleChange = (change) => {
    if (!('value' in this.props)) {
      this.setState(change);
    }
    this.triggerChange(change);
  }

  triggerChange = (changedValue) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange({ ...this.state, ...changedValue });
    }
  }

  getScaleConfig(scaleUnit) {
    switch (scaleUnit) {
      case '%':
        return { label: 'Scale', step: 0.1 };
      case 'pt':
        return { label: 'Size', step: 1 };
      default:
        return { label: 'Scale', step: 1 };
    }
  }

  render() {
    const lowercaseName = this.props.name.toLowerCase();
    const scaleConfig = this.getScaleConfig(this.props.scaleUnit);

    return (
      <Row key={this.props.name}>
        <h2>{this.props.name}</h2>
        <Col span={8}>
          <Form.Item label="X(%)">
              <InputNumber
                value={this.state.x}
                onChange={ value => this.handleChange({x: value}) }
                step={5} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Y(%)">
              <InputNumber
                value={this.state.y}
                onChange={ value => this.handleChange({y: value}) }
                step={5} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={scaleConfig.label}>
              <InputNumber
                value={this.state.scale}
                onChange={ value => this.handleChange({scale: value}) }
                step={scaleConfig.step} />
          </Form.Item>
        </Col>
      </Row>
    );
  }
}
export default TransformInput
