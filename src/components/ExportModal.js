import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Divider, Checkbox, Tag } from 'antd';
import { withTranslation } from "react-i18next";
import ExportForm from './ExportForm';
import { getExportConfig } from '../state/selectors/deck';
import { paper } from '../constants/sizes';
import 'antd/dist/antd.css';

const A4 = paper.A4;

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

  getCardsPerPage(cardsSize) {
    const { exportConfig } = this.props;
    const x = A4.width / (cardsSize.cm.width * 10 + exportConfig.spacing);
    const y = A4.height / (cardsSize.cm.height * 10 + exportConfig.spacing);

    return Math.floor(x) * Math.floor(y);
  }

  render() {
    const { exportConfig, cardSize, t } = this.props;
    const cardsSize = this.getCardsSize(cardSize);
    const cardsQuantity = Object.values(exportConfig.cardsQuantity).reduce((acc, count) => acc + count, 0);
    const cardsPerPage = this.getCardsPerPage(cardsSize);

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
              <span>{ t('export.cardsSize') }: <Tag>{ cardsSize.width } x { cardsSize.height }px</Tag><Tag>{ cardsSize.in.width } x { cardsSize.in.height }''</Tag><Tag>{ cardsSize.cm.width } x { cardsSize.cm.height }cm</Tag></span><br/>
              <span>{ t('export.cardsPerPage') }: { cardsPerPage }</span><br/>
              <span>{ t('export.cards') }: { cardsQuantity }</span><br/>
              <span>{ t('export.pages') }: { Math.ceil(cardsQuantity / cardsPerPage) }</span><br/>
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
