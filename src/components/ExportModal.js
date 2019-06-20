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

  getCardsSize(cardSize) {
    const precision = num => Math.round(num * 100) / 100;
    const inches = {
      height: precision(cardSize.height / this.props.exportConfig.dpi),
      width: precision(cardSize.width / this.props.exportConfig.dpi),
    };
    const centimeters = {
      height: precision(inches.height * 2.54),
      width: precision(inches.width * 2.54),
    };

    return {
      ...cardSize,
      in: inches,
      cm: centimeters,
    };
  }

  render() {
    const { exportConfig, cardSize, t } = this.props;
    const cardsSize = this.getCardsSize(cardSize);
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
              <p>{ t('export.cardsSize') }: { cardsSize.width }x{ cardsSize.height }px - { cardsSize.in.width }x{ cardsSize.in.height }'' - { cardsSize.cm.width }x{ cardsSize.cm.height }cm</p>
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
