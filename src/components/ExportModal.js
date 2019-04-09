import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Divider, Checkbox } from 'antd';
import ExportForm from './ExportForm';
import { getExportConfig } from '../state/selectors/deck';
import 'antd/dist/antd.css';

class ExportModal extends Component {

  state = { forceExport: false }

  handleOk = (e) => {
    if (this.props.onExport)
      this.props.onExport();
    this.toggleForceExport(false);
  }

  handleCancel = (e) => {
    if (this.props.onCancel)
      this.props.onCancel();
  }

  toggleForceExport = forceExport => this.setState({ forceExport });

  render() {
    const cardsSize = this.props.cardSize;
    const cardsQuantity = Object.values(this.props.exportConfig.cardsQuantity).reduce((acc, count) => acc + count, 0);

    return (
      <div>
        <Modal
          title="Deck export"
          visible={ this.props.visible }

          onOk={ this.handleOk }
          okText="Export"
          okButtonProps={{ disabled: cardsSize.multipleSizes && !this.state.forceExport }}

          onCancel={ this.handleCancel }
        >
          <ExportForm />

          <Divider />

          { cardsSize.multipleSizes
            ? (
            <React.Fragment>
              <p>This deck have multiple card sizes, please fix them before export.</p>
              <Checkbox onChange={ event => this.toggleForceExport(event.target.checked) }> I understand by I still want to export my deck.</Checkbox>
            </React.Fragment>
            )
            : (
            <React.Fragment>
              <p>Cards size (px): { cardsSize.width }x{ cardsSize.height }</p>
              <p>Cards quantity: { cardsQuantity }</p>
            </React.Fragment>
          ) }
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  exportConfig: getExportConfig(state),
  cardSize: state.deck.cardSize,
});

export default connect(mapStateToProps)(ExportModal);
