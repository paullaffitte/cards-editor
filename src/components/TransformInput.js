import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, InputNumber, Input, Select, Row, Col } from 'antd'

const { Option } = Select;

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
      default:
        return { label: 'Size', step: 1 };
    }
  }

  render() {
    const scaleConfig = this.getScaleConfig(this.props.scaleUnit);
    const span = this.props.disableTextOption ? 8 : 5;

    return (
      <Row key={this.props.name}>
        <h2>{this.props.name}</h2>
        <Col span={span}>
          <Form.Item label="X(%)">
              <InputNumber
                value={this.state.x}
                onChange={ value => this.handleChange({ x: value }) }
                step={5} />
          </Form.Item>
        </Col>
        <Col span={span}>
          <Form.Item label="Y(%)">
              <InputNumber
                value={this.state.y}
                onChange={ value => this.handleChange({ y: value }) }
                step={5} />
          </Form.Item>
        </Col>
        <Col span={span}>
          <Form.Item label={scaleConfig.label}>
              <InputNumber
                value={this.state.scale}
                onChange={ value => this.handleChange({ scale: value }) }
                step={scaleConfig.step} />
          </Form.Item>
        </Col>

        { !this.props.disableTextOption ? (
          <Col span={span - 1} style={{ paddingRight: '1em' }}>
            <Form.Item label="Color">
              <Input
                type="color"
                value={this.state.color}
                onChange={ e => this.handleChange({ color: e.target.value === '#000000' ? null : e.target.value }) }
                />
            </Form.Item>
          </Col>
        ) : null }

        { !this.props.disableTextOption ? (
          <Col span={span}>
            <Form.Item label="Font">
              <Select
                showSearch
                placeholder="Select a font"
                optionFilterProp="children"
                value={this.state.font}
                onChange={ value => this.handleChange({ font: value }) }
                filterOption={ (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 } >
                { this.props.availableFonts.map(fontName => (<Option key={fontName} value={fontName}>{fontName}</Option>)) }
              </Select>
            </Form.Item>
          </Col>
        ) : null }
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  availableFonts: state.availableFonts
});

export default connect(mapStateToProps)(TransformInput);
