import React, { Component } from 'react';
import { Row, Col, Icon, Modal, Button } from 'antd';
import ResourcesEditor from './ResourcesEditor'

class ResourcePicker extends React.Component {

  state = {
    preview: {
      name: null,
      url: null,
    },
    value: {},
    modalOpened: false
  };

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        value: { ...(nextProps.value || {}) },
      };
    }
    return null;
  }

  onPreview = file => {
    this.setState({preview: {name: file.name, url: file.url}});
  };

  toggleModal = visible => {
    this.setState({modalOpened: visible !== undefined ? (visible == true) : !this.state.modalOpened})
  };

  onSubmit = () => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange({ ...this.state.preview });
    }
    this.toggleModal(false);
  };

  onCancel = () => this.toggleModal(false);

  render() {
    const {preview, modalOpened} = this.state;
    return (
      <div>
        <Button onClick={() => this.toggleModal(true)}>
          <Icon type="search" /> Choose
        </Button>
        <div>{ this.state.value.name }</div>
        <Modal visible={modalOpened} width='900px' onCancel={this.onCancel}
          footer={[
            <Button key="back" onClick={this.onCancel}>Return</Button>,
            <Button key="submit" type="primary" onClick={this.onSubmit}>
              Submit
            </Button>,
          ]}>
          <h2>Resources</h2>
          <Row>
          <Col span={14}>
            <ResourcesEditor onPreview={this.onPreview} style={{ marginBottom: '1em' }} />
          </Col>
          <Col span={9} offset={1}>
            {!preview.url ? '' : (<img alt="example" style={{ width: '100%' }} src={preview.url} />)}
            <span>{preview.name}</span>
          </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

export default ResourcePicker;
