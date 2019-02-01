import React, { Component } from 'react';
import { Modal } from 'antd';
import ExportForm from './ExportForm';
import 'antd/dist/antd.css';

class ExportModal extends Component {

  handleOk = (e) => {
    if (this.props.onExport)
      this.props.onExport();
  }

  handleCancel = (e) => {
    if (this.props.onCancel)
      this.props.onCancel();
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
