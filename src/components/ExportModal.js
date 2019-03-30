import React, { Component } from 'react';
import { Modal } from 'antd';
import ExportForm from './ExportForm';
import 'antd/dist/antd.css';

class ExportModal extends Component {

  onClose = () => {
    if (this.props.onClose)
      this.props.onClose();
  }

  handleOk = (e) => {
    this.onClose();
  }

  handleCancel = (e) => {
    this.onClose();
  }

  render() {
    return (
      <div>
        <Modal
          title="Deck export"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="Export"
        >
          <ExportForm />
        </Modal>
      </div>
    );
  }
}

export default ExportModal;
