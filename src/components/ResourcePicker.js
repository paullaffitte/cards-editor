import React, { Component } from 'react';
import { Row, Col, Icon, Modal, Button } from 'antd';
import ResourcesEditor from './ResourcesEditor'

class ResourcePicker extends React.Component {

  state = {
    picked: {
      name: null,
      url: null,
    },
    modalOpened: false
  };

  onPick = file => {
    this.setState({picked: {name: file.name, url: file.url}});
    console.log('onPreview picker', file.name, file.url, file);
  };

  toggleModal = visible => {
    this.setState({modalOpened: visible !== undefined ? (visible == true) : !this.state.modalOpened})
  }

  render() {
    const {picked, modalOpened} = this.state;
    return (
      <div>
        <Button onClick={() => this.toggleModal(true)}>
          <Icon type="search" /> Choose
        </Button>
        <Modal visible={modalOpened} width='900px' footer={null} onCancel={() => this.toggleModal(false)}>
          <h2>Resources</h2>
          <Row>
          <Col span={14}>
            <ResourcesEditor onPreview={this.onPick} style={{ marginBottom: '1em' }} />
          </Col>
          <Col span={9} offset={1}>
            {!picked.url ? '' : (<img alt="example" style={{ width: '100%' }} src={picked.url} />)}
            <span>{picked.name}</span>
          </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

export default ResourcePicker;
