import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Divider, Checkbox } from 'antd';
import { withTranslation } from "react-i18next";
import ExportForm from './ExportForm';
import { getExportConfig } from '../state/selectors/deck';
import 'antd/dist/antd.css';

class ExportModal extends Component {

  state = { forceExport: false }

  handleOk = (e) => {
    if (this.props.onExport)
      this.props.onExport();
  }

  handleCancel = (e) => {
    if (this.props.onCancel)
      this.props.onCancel();
  }

  toggleForceExport = forceExport => this.setState({ forceExport });

  render() {
    const { exportConfig, cardSize, t } = this.props;
    const cardsSize = cardSize;
    const cardsQuantity = Object.values(exportConfig.cardsQuantity).reduce((acc, count) => acc + count, 0);

    return (
      <div>
        <Modal
          title={ t('export.deckExport') }
          visible={ this.props.visible }

          onOk={ this.handleOk }
          okText={ t('export.export') }
          okButtonProps={{ disabled: cardsSize.multipleSizes && !this.state.forceExport }}

          onCancel={ this.handleCancel }
        >
          <ExportForm />

          <Divider />

          { cardsSize.multipleSizes
            ? (
            <React.Fragment>
              <p>{ t('export.messages.multipleCardSizes') }</p>
              <Checkbox onChange={ event => this.toggleForceExport(event.target.checked) }>{ t('export.messages.confirmAnyway') }</Checkbox>
            </React.Fragment>
            )
            : (
            <React.Fragment>
              <p>{ t('export.cardsSize') } (px): { cardsSize.width }x{ cardsSize.height }</p>
              <p>{ t('export.cardsQuantity') }: { cardsQuantity }</p>
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

export default withTranslation()(connect(mapStateToProps)(ExportModal));
