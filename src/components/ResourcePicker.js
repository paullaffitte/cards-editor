import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Icon, Modal, Button } from 'antd';
import ResourcesEditor from './ResourcesEditor'
import { getResources } from '../state/selectors/deck';

class ResourcePicker extends React.Component {

  state = {
    preview: {
      name: null,
      url: null,
    },
    modalOpened: false
  };

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  onPreview = file => {
    this.setState({preview: {name: file.name, url: file.url}});
  };

  toggleModal = visible => {
    if (this.props.value) {
      if (!(this.props.value in this.props.resources))
        alert(`Error: Resource ${this.props.value} not found`);
      else {
        const preview = {
          name: this.props.value,
          url: 'file://' + this.props.resources[this.props.value]
        };
        this.setState({ preview });
      }
    }

    this.setState({ modalOpened: visible !== undefined ? (visible == true) : !this.state.modalOpened });
  };

  onSubmit = () => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(this.state.preview.name);
    }
    this.toggleModal(false);
  };

  onCancel = () => this.toggleModal(false);

  render() {
    const {preview, modalOpened} = this.state;
    return (
      <div>
        <div>{ this.state.value }</div>
        <Button onClick={() => this.toggleModal(true)}>
          <Icon type="search" /> Choose
        </Button>

        <Modal visible={modalOpened} width='900px' onCancel={this.onCancel}
          footer={[
            <Button key="back" onClick={this.onCancel}>Return</Button>,
            <Button key="submit" type="primary" onClick={this.onSubmit}>Select</Button>,
          ]}>
          <h2>Resources</h2>
          <Row>
          <Col span={14}>
            <ResourcesEditor selected={this.state.value} onPreview={this.onPreview} style={{ marginBottom: '1em' }} />
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

const mapStateToProps = (state, props) => ({
  resources: getResources(state)
});

export default connect(mapStateToProps)(ResourcePicker);
